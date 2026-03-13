import { SurveyText } from '$lib/content/text';
import { db } from '$lib/server/db';
import { member, organisation } from '$lib/server/db/schema';
import { PlanTypes } from '$lib/types/PlanTypes';
import { createId } from '$lib/utils/createid';
import type { User } from 'better-auth';
import { eq } from 'drizzle-orm';
import { MemberRoleType as MemberRole } from '../db/schema';

// DON'T CALL THIS IF THE USER WAS INVITED
export const ensureOnboarded = async (user: User) => {
	// // Check that we have both a tenant, workspace, member and initial template
	// const _member = await db.query.member.findFirst({
	// 	where: eq(member.userId, user.id)
	// });

	// // If member exists then we can assume that they will already be associated
	// // with a workspace and its template(s).
	// if (_member) {
	// 	return;
	// }

	// // ...otherwise this must be an entirely new user so we must
	// // add a new  workspace, member and template.
	// const workspaceId = createId();
	// const workspaceName = 'Workspace for ' + user.name ? user.name : user.email;

	// await db.transaction(async (tx) => {
	// 	await tx
	// 		.insert(organisation)
	// 		.values({ id: workspaceId, name: workspaceName, planType: PlanTypes.Free });
	// 	await tx
	// 		.insert(member)
	// 		.values({ id: createId(), workspaceId, userId: user.id, role: MemberRole.Admin });
	// 	await tx.insert(template).values({
	// 		id: createId(),
	// 		workspaceId,
	// 		surveyTitle: SurveyText.surveyTitle,
	// 		surveyIntro: SurveyText.surveyIntro,
	// 		surveyRatingQuestion: SurveyText.surveyRatingQuestion,
	// 		surveyCommentPrompt: SurveyText.surveyCommentPrompt,
	// 		surveyEmailPrompt: SurveyText.surveyEmailPrompt,
	// 		surveyEmailDisclaimer: SurveyText.surveyEmailDisclaimer,
	// 		thankyouTitle: SurveyText.thankyouTitle,
	// 		thankyouText: SurveyText.thankyouText,
	// 		thankyouClose: SurveyText.thankyouClose
	// 	});
	// });
};
