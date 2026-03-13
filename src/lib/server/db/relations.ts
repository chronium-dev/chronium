import { relations } from 'drizzle-orm';
import { account, member, organisation, session, user } from './schema';

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
	accounts: many(account)
}));

// Organization relations
export const organizationRelations = relations(organisation, ({ many }) => ({
	members: many(member)
}));

export const memberRelations = relations(member, ({ one }) => ({
	// A member has one workspace
	workspace: one(organisation, { fields: [member.organisationId], references: [organisation.id] }),
	// A member has one user
	user: one(user, { fields: [member.userId], references: [user.id] })
}));
