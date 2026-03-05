import { relations } from 'drizzle-orm';
import { account, session, user } from './schema';
import { member, plan, rating, ratingReply, template, workspace } from './schema';

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	members: many(member),
	accounts: many(account),

	// Rating relations
	ratingsRead: many(rating, { relationName: 'ratingReadBy' }),
	ratingsClosed: many(rating, { relationName: 'ratingClosedBy' }),
	ratingsLastUpdated: many(rating, { relationName: 'ratingLastUpdatedBy' }),

	// Rating reply relations
	repliesCreated: many(ratingReply, { relationName: 'replyCreatedBy' }),
	repliesRead: many(ratingReply, { relationName: 'replyReadBy' }),
	repliesAsUser: many(ratingReply, { relationName: 'replyUser' })
}));

// Relations for Plan Types
export const planTypesRelations = relations(plan, ({ many }) => ({
	// A plan type can be used by MANY workspaces
	workspaces: many(workspace)
	// subscriptions: many(subscriptions)
}));

// Workspace relations
export const workspaceRelations = relations(workspace, ({ one, many }) => ({
	templates: many(template),
	members: many(member),
	planType: one(plan, { fields: [workspace.planType], references: [plan.planType] })
}));

export const memberRelations = relations(member, ({ one }) => ({
	// A member has one workspace
	workspace: one(workspace, { fields: [member.workspaceId], references: [workspace.id] }),
	// A member has one user
	user: one(user, { fields: [member.userId], references: [user.id] })
}));

// Templates relations
export const templatesRelations = relations(template, ({ one, many }) => ({
	// A template has one workspace
	workspace: one(workspace, {
		fields: [template.workspaceId],
		references: [workspace.id]
	}),
	// A template has many ratings
	ratings: many(rating)
}));

export const ratingRelations = relations(rating, ({ one, many }) => ({
	// A rating has one template
	templateRelation: one(template, {
		fields: [rating.templateId],
		references: [template.id]
	}),
	// A rating has one workspace
	workspace: one(workspace, { fields: [rating.workspaceId], references: [workspace.id] }),
	// User relations for various actions
	readBy: one(user, {
		fields: [rating.readByUserId],
		references: [user.id],
		relationName: 'ratingReadBy'
	}),
	closedBy: one(user, {
		fields: [rating.closedByUserId],
		references: [user.id],
		relationName: 'ratingClosedBy'
	}),
	lastUpdatedBy: one(user, {
		fields: [rating.lastUpdatedByUserId],
		references: [user.id],
		relationName: 'ratingLastUpdatedBy'
	}),
	replies: many(ratingReply)
}));

export const ratingReplyRelations = relations(ratingReply, ({ one }) => ({
	rating: one(rating, {
		fields: [ratingReply.ratingId],
		references: [rating.id]
	}),
	createdBy: one(user, {
		fields: [ratingReply.createdByUserId],
		references: [user.id],
		relationName: 'replyCreatedBy'
	}),
	readBy: one(user, {
		fields: [ratingReply.readByUserId],
		references: [user.id],
		relationName: 'replyReadBy'
	}),
	replyUser: one(user, {
		fields: [ratingReply.replyUserId],
		references: [user.id],
		relationName: 'replyUser'
	})
}));
