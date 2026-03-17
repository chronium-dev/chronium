// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

import { type Organisation } from '$lib/types/organisations';
import { and, count, eq } from 'drizzle-orm';
import { db } from './index';
import { member, type MemberRoleType, organisation, user } from './schema';

// ============================================================================
// ORGANISATION QUERIES
// ============================================================================
export type OrgListContextType = {
	id: string;
	name: string | null;
	logo: string | null;
	role: MemberRoleType;
};

export async function createOrg(data: Organisation) {
	const [company] = await db.insert(organisation).values(data).returning();
	return company;
}

export async function updateOrg(id: string, data: Organisation) {
	const [company] = await db
		.update(organisation)
		.set(data)
		.where(eq(organisation.id, id))
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

// ============================================================================
// TEMPLATE QUERIES
// ============================================================================

/**
 * Get all templates for a workspace
 */
// export async function getWorkspaceTemplates(workspaceId: string) {
// 	return await db.query.template.findMany({
// 		where: eq(template.workspaceId, workspaceId),
// 		orderBy: [desc(template.createdAt)]
// 	});
// }

/**
 * Get active templates only
 */
// export async function getActiveTemplates(workspaceId: string) {
// 	return await db.query.template.findMany({
// 		where: and(eq(template.workspaceId, workspaceId), eq(template.activated, true)),
// 		orderBy: [desc(template.createdAt)]
// 	});
// }

// ============================================================================
// RATING QUERIES
// ============================================================================

/**
 * Get ratings with full details including template, workspace, and user info
 */
// export async function getRatingWithDetails(ratingId: string) {
// 	return await db.query.rating.findFirst({
// 		where: eq(rating.id, ratingId),
// 		with: {
// 			template: true,
// 			workspace: true,
// 			readBy: true,
// 			closedBy: true,
// 			lastUpdatedBy: true,
// 			replies: {
// 				with: {
// 					createdBy: true,
// 					readBy: true
// 				},
// 				orderBy: [asc(ratingReply.createdAt)]
// 			}
// 		}
// 	});
// }

/**
 * Get ratings for workspace with filters
 */
// export async function getWorkspaceRatings(
// 	workspaceId: string,
// 	filters?: {
// 		starRating?: number;
// 		status?: RatingStatus;
// 		unreadOnly?: boolean;
// 		templateId?: string;
// 		startDate?: Date;
// 		endDate?: Date;
// 	}
// ) {
// 	const conditions = [eq(rating.workspaceId, workspaceId)];

// 	if (filters?.starRating) {
// 		conditions.push(eq(rating.starRating, filters.starRating));
// 	}
// 	if (filters?.status) {
// 		conditions.push(eq(rating.status, filters.status));
// 	}
// 	if (filters?.unreadOnly) {
// 		conditions.push(eq(rating.unread, true));
// 	}
// 	if (filters?.templateId) {
// 		conditions.push(eq(rating.templateId, filters.templateId));
// 	}
// 	if (filters?.startDate) {
// 		conditions.push(gte(rating.createdAt, filters.startDate));
// 	}
// 	if (filters?.endDate) {
// 		conditions.push(lte(rating.createdAt, filters.endDate));
// 	}

// 	return await db.query.rating.findMany({
// 		where: and(...conditions),
// 		with: {
// 			template: true,
// 			readBy: true,
// 			closedBy: true
// 		},
// 		orderBy: [desc(rating.touchedAt)]
// 	});
// }

// /**
//  * Get unread ratings count for workspace
//  */
// export async function getUnreadRatingsCount(workspaceId: string) {
// 	const [result] = await db
// 		.select({ count: sql<number>`count(*)` })
// 		.from(rating)
// 		.where(and(eq(rating.workspaceId, workspaceId), eq(rating.unread, true)));

// 	return Number(result.count);
// }

/**
 * Get ratings requiring action (unread or awaiting reply)
 */
// export async function getActionableRatings(workspaceId: string) {
// 	return await db.query.rating.findMany({
// 		where: and(eq(rating.workspaceId, workspaceId), eq(rating.isActionable, true)),
// 		with: {
// 			template: true,
// 			replies: {
// 				orderBy: [desc(ratingReply.createdAt)],
// 				limit: 1
// 			}
// 		},
// 		orderBy: [desc(rating.touchedAt)]
// 	});
// }

/**
 * Search ratings by comment text
 */
// export async function searchRatingsByComment(workspaceId: string, searchQuery: string) {
// 	return await db.query.rating.findMany({
// 		where: and(
// 			eq(rating.workspaceId, workspaceId),
// 			sql`${rating.enSearchComment} @@ plainto_tsquery('english', ${searchQuery})`
// 		),
// 		with: {
// 			templateRelation: true
// 		},
// 		orderBy: [desc(rating.createdAt)]
// 	});
// }

/**
 * Get ratings by customer email
 */
// export async function getRatingsByEmail(workspaceId: string, email: string) {
// 	return await db.query.rating.findMany({
// 		where: and(eq(rating.workspaceId, workspaceId), eq(rating.email, email)),
// 		with: {
// 			template: true,
// 			replies: true
// 		},
// 		orderBy: [desc(rating.createdAt)]
// 	});
// }

/**
 * Mark rating as read
 */
// export async function markRatingAsRead(ratingId: string, userId: string, userName: string) {
// 	return await db
// 		.update(rating)
// 		.set({
// 			unread: false,
// 			readAt: new Date(),
// 			readByUserId: userId,
// 			readByUserName: userName,
// 			updatedAt: new Date()
// 		})
// 		.where(eq(rating.id, ratingId))
// 		.returning();
// }

/**
 * Close rating
 */
// export async function closeRating(ratingId: string, userId: string, userName: string) {
// 	return await db
// 		.update(rating)
// 		.set({
// 			status: 'closed',
// 			closedAt: new Date(),
// 			closedByUserId: userId,
// 			closedByUserName: userName,
// 			lastUpdatedByWhom: 'user',
// 			lastUpdatedByUserId: userId,
// 			updatedAt: new Date()
// 		})
// 		.where(eq(rating.id, ratingId))
// 		.returning();
// }

/**
 * Update rating status
 */
// export async function updateRatingStatus(
// 	ratingId: string,
// 	newStatus: RatingStatus,
// 	userId?: string
// ) {
// 	return await db
// 		.update(rating)
// 		.set({
// 			status: newStatus,
// 			lastUpdatedByWhom: userId ? 'user' : 'system',
// 			lastUpdatedByUserId: userId,
// 			touchedAt: new Date(),
// 			updatedAt: new Date()
// 		})
// 		.where(eq(rating.id, ratingId))
// 		.returning();
// }

// ============================================================================
// RATING REPLY QUERIES
// ============================================================================

/**
 * Get all replies for a rating
 */
// export async function getRatingReplies(ratingId: string) {
// 	return await db.query.ratingReply.findMany({
// 		where: eq(ratingReply.ratingId, ratingId),
// 		with: {
// 			createdBy: true,
// 			readBy: true
// 		},
// 		orderBy: [asc(ratingReply.createdAt)]
// 	});
// }

/**
 * Create a reply
 */
// export async function createRatingReply(data: {
// 	ratingId: string;
// 	replyText: string;
// 	direction: 'inbound' | 'outbound';
// 	createdByUserId?: string;
// 	replyUserName?: string;
// 	linkEmail?: string;
// 	linkMessageType?: string;
// }) {
// 	return await db
// 		.insert(ratingReply)
// 		.values({
// 			...data,
// 			unread: data.direction === 'inbound', // Mark inbound as unread
// 			createdAt: new Date(),
// 			updatedAt: new Date()
// 		})
// 		.returning();
//}

/**
 * Mark reply as read
 */
// export async function markReplyAsRead(replyId: number, userId: string, userName: string) {
// 	return await db
// 		.update(ratingReply)
// 		.set({
// 			unread: false,
// 			readAt: new Date(),
// 			readByUserId: userId,
// 			readByUserName: userName,
// 			updatedAt: new Date()
// 		})
// 		.where(eq(ratingReply.id, replyId))
// 		.returning();
// }

/**
 * Get unread replies for a workspace
 */
// export async function getUnreadReplies(workspaceId: string) {
// 	return await db
// 		.select()
// 		.from(ratingReply)
// 		.innerJoin(rating, eq(ratingReply.ratingId, rating.id))
// 		.where(and(eq(rating.workspaceId, workspaceId), eq(ratingReply.unread, true)))
// 		.orderBy(desc(ratingReply.createdAt));
// }

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

/**
 * Get rating statistics for workspace
 */
// export async function getWorkspaceRatingStats(
// 	workspaceId: string,
// 	startDate?: Date,
// 	endDate?: Date
// ) {
// 	const conditions = [eq(rating.workspaceId, workspaceId)];

// 	if (startDate) {
// 		conditions.push(gte(rating.createdAt, startDate));
// 	}
// 	if (endDate) {
// 		conditions.push(lte(rating.createdAt, endDate));
// 	}

// 	const [stats] = await db
// 		.select({
// 			totalRatings: sql<number>`count(*)`,
// 			averageRating: sql<number>`avg(${rating.starRating})`,
// 			oneStar: sql<number>`sum(case when ${rating.starRating} = 1 then 1 else 0 end)`,
// 			twoStar: sql<number>`sum(case when ${rating.starRating} = 2 then 1 else 0 end)`,
// 			threeStar: sql<number>`sum(case when ${rating.starRating} = 3 then 1 else 0 end)`,
// 			fourStar: sql<number>`sum(case when ${rating.starRating} = 4 then 1 else 0 end)`,
// 			fiveStar: sql<number>`sum(case when ${rating.starRating} = 5 then 1 else 0 end)`,
// 			withComments: sql<number>`sum(case when ${rating.comment} is not null then 1 else 0 end)`,
// 			withEmail: sql<number>`sum(case when ${rating.email} is not null then 1 else 0 end)`
// 		})
// 		.from(rating)
// 		.where(and(...conditions));

// 	return {
// 		totalRatings: Number(stats.totalRatings),
// 		averageRating: Number(stats.averageRating?.toFixed(2)),
// 		distribution: {
// 			1: Number(stats.oneStar),
// 			2: Number(stats.twoStar),
// 			3: Number(stats.threeStar),
// 			4: Number(stats.fourStar),
// 			5: Number(stats.fiveStar)
// 		},
// 		withComments: Number(stats.withComments),
// 		withEmail: Number(stats.withEmail)
// 	};
// }

/**
 * Get ratings by month for trend analysis
 */
// export async function getRatingsByMonth(workspaceId: string, numberOfMonths: number = 12) {
// 	const startDate = new Date();
// 	startDate.setMonth(startDate.getMonth() - numberOfMonths);

// 	return await db
// 		.select({
// 			month: sql<string>`to_char(${rating.createdAt}, 'YYYY-MM')`,
// 			count: sql<number>`count(*)`,
// 			averageRating: sql<number>`avg(${rating.starRating})`
// 		})
// 		.from(rating)
// 		.where(and(eq(rating.workspaceId, workspaceId), gte(rating.createdAt, startDate)))
// 		.groupBy(sql`to_char(${rating.createdAt}, 'YYYY-MM')`)
// 		.orderBy(sql`to_char(${rating.createdAt}, 'YYYY-MM')`);
// }

/**
 * Get ratings by template performance
 */
// export async function getTemplatePerformance(
// 	workspaceId: string,
// 	startDate?: Date,
// 	endDate?: Date
// ) {
// 	const conditions = [eq(rating.workspaceId, workspaceId)];

// 	if (startDate) {
// 		conditions.push(gte(rating.createdAt, startDate));
// 	}
// 	if (endDate) {
// 		conditions.push(lte(rating.createdAt, endDate));
// 	}

// 	return await db
// 		.select({
// 			templateId: rating.templateId,
// 			templateName: template.templateName,
// 			count: sql<number>`count(*)`,
// 			averageRating: sql<number>`avg(${rating.starRating})`,
// 			responseRate: sql<number>`sum(case when ${rating.email} is not null then 1 else 0 end)::float / count(*) * 100`
// 		})
// 		.from(rating)
// 		.leftJoin(template, eq(rating.templateId, template.id))
// 		.where(and(...conditions))
// 		.groupBy(rating.templateId, template.templateName)
// 		.orderBy(desc(sql`count(*)`));
// }

/**
 * Get response time statistics
 */
// export async function getResponseTimeStats(workspaceId: string) {
// 	return await db
// 		.select({
// 			ratingId: rating.id,
// 			createdAt: rating.createdAt,
// 			firstReplyAt: sql<Date>`min(${ratingReply.createdAt})`,
// 			responseTimeHours: sql<number>`extract(epoch from (min(${ratingReply.createdAt}) - ${rating.createdAt})) / 3600`
// 		})
// 		.from(rating)
// 		.innerJoin(ratingReply, eq(ratingReply.ratingId, rating.id))
// 		.where(and(eq(rating.workspaceId, workspaceId), eq(ratingReply.direction, 'outbound')))
// 		.groupBy(rating.id, rating.createdAt)
// 		.orderBy(desc(rating.createdAt));
// }

// ============================================================================
// MEMBER MANAGEMENT
// ============================================================================

/**
 * Add member to workspace
 */
// export async function addWorkspaceMember(
// 	workspaceId: string,
// 	userId: string,
// 	role: 'owner' | 'admin' | 'member' = 'member'
// ) {
// 	return await db
// 		.insert(member)
// 		.values({
// 			id: crypto.randomUUID(),
// 			workspaceId,
// 			userId,
// 			role,
// 			createdAt: new Date(),
// 			updatedAt: new Date()
// 		})
// 		.returning();
// }

/**
 * Remove member from workspace
 */
// export async function removeWorkspaceMember(workspaceId: string, userId: string) {
// 	return await db
// 		.delete(member)
// 		.where(and(eq(member.organisationId, workspaceId), eq(member.userId, userId)))
// 		.returning();
// }

/**
 * Update member role
 */
export async function updateMemberRole(
	workspaceId: string,
	userId: string,
	newRole: 'owner' | 'admin' | 'member'
) {
	return await db
		.update(member)
		.set({
			role: newRole,
			updatedAt: new Date()
		})
		.where(and(eq(member.organisationId, workspaceId), eq(member.userId, userId)))
		.returning();
}

/**
 * Get workspace members count
 */
// export async function getWorkspaceMembersCount(workspaceId: string) {
// 	const [result] = await db
// 		.select({ count: sql<number>`count(*)` })
// 		.from(member)
// 		.where(eq(member.organisationId, workspaceId));

// 	return Number(result.count);
// }

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk mark ratings as read
 */
// export async function bulkMarkRatingsAsRead(ratingIds: string[], userId: string, userName: string) {
// 	return await db
// 		.update(rating)
// 		.set({
// 			unread: false,
// 			readAt: new Date(),
// 			readByUserId: userId,
// 			readByUserName: userName,
// 			updatedAt: new Date()
// 		})
// 		.where(inArray(rating.id, ratingIds))
// 		.returning();
// }

/**
 * Bulk close ratings
 */
// export async function bulkCloseRatings(ratingIds: string[], userId: string, userName: string) {
// 	return await db
// 		.update(rating)
// 		.set({
// 			status: 'closed',
// 			closedAt: new Date(),
// 			closedByUserId: userId,
// 			closedByUserName: userName,
// 			updatedAt: new Date()
// 		})
// 		.where(inArray(rating.id, ratingIds))
// 		.returning();
// }

/**
 * Delete test ratings
 */
// export async function deleteTestRatings(workspaceId: string) {
// 	return await db
// 		.delete(rating)
// 		.where(and(eq(rating.workspaceId, workspaceId), eq(rating.generatedForTesting, true)))
// 		.returning();
// }

// ============================================================================
// EXPORT
// ============================================================================

// Export all query functions
export const queries = {
	// Workspace
	// getWorkspaceWithMembers,
	// getUserWorkspaces,
	isUserMemberOfWorkspace,
	getUserWorkspaceRole,
	// getWorkspaceQuotaUsage,

	// Templates
	// getWorkspaceTemplates,
	// getActiveTemplates,

	// Ratings
	// getRatingWithDetails,
	// getWorkspaceRatings,
	// getUnreadRatingsCount,
	// getActionableRatings,
	// searchRatingsByComment,
	// getRatingsByEmail,
	// markRatingAsRead,
	// closeRating,
	// updateRatingStatus,

	// Replies
	// getRatingReplies,
	// createRatingReply,
	// markReplyAsRead,
	// getUnreadReplies,

	// Analytics
	// getWorkspaceRatingStats,
	// getRatingsByMonth,
	// getTemplatePerformance,
	// getResponseTimeStats,

	// Members
	// addWorkspaceMember,
	// removeWorkspaceMember,
	updateMemberRole
	// getWorkspaceMembersCount,

	// Bulk operations
	// bulkMarkRatingsAsRead,
	// bulkCloseRatings,
	// deleteTestRatings
};
