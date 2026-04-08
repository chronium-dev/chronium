// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

import { entityTypeUkLtd, jurisdictionUK } from '$lib/config/ukdata';
import type { Organisation } from '$lib/types/organisations';
import { createId } from '$lib/utils/createid';
import type { OrganisationFormData } from '$lib/validations/organisation';
import { and, count, eq } from 'drizzle-orm';
import { mapOrgFormDataToDbValues } from '../../mappers/organisation';
import { db, getExecutor, type DBExecutor } from './index';
import { member, MemberRole, organisation, user } from './schema';

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

	return { ok: true, org };
}

export async function updateOrg(data: OrganisationFormData) {
	const [company] = await db
		.update(organisation)
		.set(mapOrgFormDataToDbValues(data))
		.where(eq(organisation.id, data.id!))
		.returning();
	return company;
}

export async function getOrgs(userId: string): Promise<OrgListContextType[]> {
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

export async function getOrg(orgId: string) {
	const [org] = await db.select().from(organisation).where(eq(organisation.id, orgId));
	return org;
}

export async function getOrgCount(userId: string) {
	const [result] = await db
		.select({ value: count() })
		.from(member)
		.where(eq(member.userId, userId));
	return result;
}

// ============================================================================
// WORKSPACE QUERIES
// ============================================================================

/**
 * Get user templates
 */
// export async function getUserTemplates(userId: string) {
// 	// First get the user's workspace memberships
// 	const memberships = await db.query.member.findMany({
// 		where: eq(member.userId, userId),
// 		with: {
// 			workspace: {
// 				with: {
// 					templates: true
// 				}
// 			}
// 		}
// 	});

// 	// Transform to the desired structure
// 	const result = memberships.map((membership) => ({
// 		workspaceId: membership.workspace.id,
// 		workspaceName: membership.workspace.name,
// 		planType: membership.workspace.planType,
// 		workspaceCreatedAt: membership.workspace.createdAt,
// 		memberRole: membership.role,
// 		templates: membership.workspace.templates.map((template) => ({
// 			templateId: template.id,
// 			templateName: template.templateName,
// 			templateCreatedAt: template.createdAt
// 		}))
// 	}));

// 	return result;
// }

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

/**
 * Get all workspaces for a user
 */
// export async function getUserWorkspaces(userId: string) {
// 	return await db.query.member.findMany({
// 		where: eq(member.userId, userId),
// 		with: {
// 			workspace: {
// 				with: {
// 					planType: true
// 				}
// 			}
// 		}
// 	});
// }

/**
 * Check if user is member of workspace
 */
export async function isUserMemberOfWorkspace(userId: string, workspaceId: string) {
	const membership = await db.query.member.findFirst({
		where: and(eq(member.userId, userId), eq(member.organisationId, workspaceId))
	});
	return !!membership;
}

/**
 * Get user's role in workspace
 */
export async function getUserWorkspaceRole(userId: string, workspaceId: string) {
	const membership = await db.query.member.findFirst({
		where: and(eq(member.userId, userId), eq(member.organisationId, workspaceId))
	});
	return membership?.role;
}

/**
 * Get workspace quota usage for current period
 */
// export async function getWorkspaceQuotaUsage(workspaceId: string, startDate: Date, endDate: Date) {
// 	const [ratingsCount] = await db
// 		.select({ count: sql<number>`count(*)` })
// 		.from(rating)
// 		.where(
// 			and(
// 				eq(rating.workspaceId, workspaceId),
// 				gte(rating.createdAt, startDate),
// 				lte(rating.createdAt, endDate)
// 			)
// 		);

// 	const [emailsCount] = await db
// 		.select({ count: sql<number>`count(*)` })
// 		.from(ratingReply)
// 		.innerJoin(rating, eq(ratingReply.ratingId, rating.id))
// 		.where(
// 			and(
// 				eq(rating.workspaceId, workspaceId),
// 				isNotNull(ratingReply.linkEmail),
// 				gte(ratingReply.createdAt, startDate),
// 				lte(ratingReply.createdAt, endDate)
// 			)
// 		);

// 	return {
// 		ratingsUsed: Number(ratingsCount.count),
// 		emailsUsed: Number(emailsCount.count)
// 	};
// }

/**
 * Get all members of a workspace
 */
export async function getWorkspaceMembers(workspaceId: string) {
	return await db
		.select({
			user,
			member
		})
		.from(member)
		.innerJoin(user, eq(user.id, member.userId))
		.where(eq(member.organisationId, workspaceId));
}

/**
 * Check if a user is an owner of a workspace
 */
export async function isUserWorkspaceOwner(userId: string, workspaceId: string): Promise<boolean> {
	const result = await db
		.select()
		.from(member)
		.where(
			and(
				eq(member.userId, userId),
				eq(member.organisationId, workspaceId),
				eq(member.role, 'owner')
			)
		)
		.limit(1);

	return result.length > 0;
}
