// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

import { entityTypeUkLtd, jurisdictionUK } from '$lib/config/ukdata';
import { invalidateUserAccessContext, invalidateUserAccessContexts } from '$lib/server/cache/userAccessContextCache';
import type { ObligationRuntimeContext } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { createId } from '$lib/utils/createid';
import type { OrganisationFormData } from '$lib/validations/organisation';
import { and, count, eq, isNull } from 'drizzle-orm';
import { mapOrgFormDataToDbValues } from '../../mappers/organisation';
import { db, getExecutor, type DBExecutor } from './index';
import {
	member,
	MemberRole,
	ObligationCategoryType,
	obligationTemplates,
	organisation,
	organisationObligationSettings,
	user
} from './schema';

// ============================================================================
// ORGANISATION QUERIES
// ============================================================================
export type OrgListContextType = {
	id: string;
	name: string | null;
	logo: string | null;
	role: MemberRole;
};

export type CreateOrgResult = { ok: true; org: Organisation } | { ok: false; message: string };

export async function createOrg(
	data: OrganisationFormData,
	userId: string,
	tx?: DBExecutor
): Promise<CreateOrgResult> {
	const db = getExecutor(tx);

	// 1. Check for existing organization (e.g., by Name)
	const existing = await db.query.organisation.findFirst({
		where: (org, { eq }) => eq(org.name, data.name)
	});

	if (existing) {
		return {
			ok: false,
			message: 'An organisation with this name already exists.'
		};
	}

	const [org] = await db
		.insert(organisation)
		.values({
			...mapOrgFormDataToDbValues(data),
			id: createId(),
			jurisdictionId: jurisdictionUK.id,
			entityTypeId: entityTypeUkLtd.id
		})
		.returning();

	await db.insert(member).values({ organisationId: org.id, userId, role: MemberRole.Owner });

	// Set default org if none exists. 
	// Prevents overwriting when users create additional orgs later.
	await db
		.update(user)
		.set({ defaultOrgId: org.id })
		.where(and(eq(user.id, userId), isNull(user.defaultOrgId)));

	await seedOrganisationObligationSettings(org.id, tx);

	await invalidateUserAccessContext(userId);

	return { ok: true, org };
}

export async function updateOrg(data: OrganisationFormData, tx?: DBExecutor) {
	const db = getExecutor(tx);

	const [company] = await db
		.update(organisation)
		.set(mapOrgFormDataToDbValues(data))
		.where(eq(organisation.id, data.id!))
		.returning();
	return company;
}

export async function getOrgs(userId: string, tx?: DBExecutor): Promise<OrgListContextType[]> {
	const db = getExecutor(tx);

	const orgs = await db
		.select({
			id: organisation.id,
			name: organisation.name,
			logo: organisation.logo,
			role: member.role
		})
		.from(organisation)
		.innerJoin(member, eq(member.organisationId, organisation.id))
		.where(eq(member.userId, userId));

	return orgs;
}

export async function getOrg(orgId: string, tx?: DBExecutor) {
	const db = getExecutor(tx);
	const [org] = await db.select().from(organisation).where(eq(organisation.id, orgId));
	return org;
}

export async function getOrgCount(userId: string, tx?: DBExecutor) {
	const db = getExecutor(tx);
	const [result] = await db
		.select({ value: count() })
		.from(member)
		.where(eq(member.userId, userId));
	return result;
}

export async function deleteOrg(orgId: string, userId: string) {
	await db.transaction(async (tx) => {
		const orgMembers = await getOrganisationMembers(orgId, tx);
		const [org] = await tx.delete(organisation).where(eq(organisation.id, orgId));
		// Invalidate cache for all members of this orgId
		await invalidateUserAccessContexts(orgMembers.map(m => m.member.userId));
		return org;
	});
}

/**
 * Check if user is member of organisation
 */
export async function isUserMemberOfOrganisation(userId: string, orgId: string) {
	const membership = await db.query.member.findFirst({
		where: and(eq(member.userId, userId), eq(member.organisationId, orgId))
	});
	return !!membership;
}

/**
 * Get user's role in organisation
 */
export async function getUserOrganisationRole(userId: string, orgId: string) {
	const membership = await db.query.member.findFirst({
		where: and(eq(member.userId, userId), eq(member.organisationId, orgId))
	});
	return membership?.role;
}

/**
 * Get all members of a organisation
 */
export async function getOrganisationMembers(orgId: string, tx?: DBExecutor) {
	const db = getExecutor(tx);

	return await db
		.select({
			user,
			member
		})
		.from(member)
		.innerJoin(user, eq(user.id, member.userId))
		.where(eq(member.organisationId, orgId));
}

/**
 * Check if a user is an owner of a organisation
 */
export async function isUserOrganisationOwner(userId: string, orgId: string): Promise<boolean> {
	const result = await db
		.select()
		.from(member)
		.where(
			and(eq(member.userId, userId), eq(member.organisationId, orgId), eq(member.role, 'owner'))
		)
		.limit(1);

	return result.length > 0;
}

export async function setActiveOrg(userId: string, orgId: string) {
	// validate membership first
	const membership = await db.query.member.findFirst({
		where: and(eq(member.userId, userId), eq(member.organisationId, orgId))
	});

	if (!membership) {
		throw new Error('Unauthorized');
	}

	await db.update(user).set({ defaultOrgId: orgId }).where(eq(user.id, userId));

	await invalidateUserAccessContext(userId);
}

// ============================================================================
// OBLIGATION QUERIES
// ============================================================================

/**
 *
 * @param orgId Create links (join) between organisation and obligationTemplates
 * @param tx
 */
export async function seedOrganisationObligationSettings(orgId: string, tx?: DBExecutor) {
	const db = getExecutor(tx);

	const templates = await db.select().from(obligationTemplates);

	await db.insert(organisationObligationSettings).values(
		templates.map((t) => ({
			key: t.key,
			organisationId: orgId,
			obligationTemplateId: t.id,
			enabled: t.category === ObligationCategoryType.Statutory // default rule
		}))
	);
}

export async function buildObligationRuntimeContext(
	orgId: string,
	tx?: DBExecutor
): Promise<ObligationRuntimeContext> {
	const db = getExecutor(tx);
	const rows = await db
		.select({
			key: organisationObligationSettings.key,
			id: organisationObligationSettings.id,
			enabled: organisationObligationSettings.enabled
		})
		.from(organisationObligationSettings)
		.where(eq(organisationObligationSettings.organisationId, orgId));

	const enabledKeys = new Set<string>();
	const definitionMap: Record<string, { id: string; key: string }> = {};

	for (const row of rows) {
		definitionMap[row.key] = { id: row.id, key: row.key };

		if (row.enabled) {
			enabledKeys.add(row.key);
		}
	}

	return { enabledKeys, definitionMap };
}

// export async function computeBasicUserContext(userId: string): Promise<BasicUserContext> {
export async function computeBasicUserContext(userId: string) {
	// TODO - update this!
	return null;
}

// const workspaceMembership = await getUserTemplates(userId);

// if (workspaceMembership.length !== 1 || workspaceMembership[0].planType !== PlanTypes.Free) {
// 	return { isBasicUser: false };
// }

// const templates = workspaceMembership[0].templates;

// if (templates.length !== 1) {
// 	return { isBasicUser: false };
// }

// return {
// 	isBasicUser: true,
// 	workspaceId: workspaceMembership[0].workspaceId,
// 	templateId: templates[0].templateId
// };
// }

/**
 * Get workspace with all members and their user info
 */
// export async function getWorkspaceWithMembers(workspaceId: string) {
// 	return await db.query.workspace.findFirst({
// 		where: eq(organization.id, workspaceId),
// 		with: {
// 			members: {
// 				with: {
// 					user: true
// 				}
// 			},
// 			planType: true
// 		}
// 	});
// }
