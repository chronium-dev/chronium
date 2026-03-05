import type { UserAccessContext } from '$lib/server/cache/cache';
import { getUserTemplates } from '$lib/server/db/queries';
import { PlanTypes } from '$lib/types/PlanTypes';

export async function computeUserAccessContext(userId: string): Promise<UserAccessContext> {
	const memberships = await getUserTemplates(userId);

	const workspaceCount = memberships.length;

	const templateCount = memberships.reduce((acc, m) => acc + m.templates.length, 0);

	let basic: UserAccessContext['basic'] = {
		isBasicUser: false
	};

	if (workspaceCount === 1 && memberships[0].planType === PlanTypes.Free && templateCount === 1) {
		basic = {
			isBasicUser: true,
			workspaceId: memberships[0].workspaceId,
			templateId: memberships[0].templates[0].templateId
		};
	}

	return {
		workspaceCount,
		templateCount,
		basic
	};
}
