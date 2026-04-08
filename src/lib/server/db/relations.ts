import { relations } from 'drizzle-orm';
import {
	account,
	entityTypes,
	jurisdictions,
	member,
	obligationDefinitions,
	obligations,
	organisation,
	recurrenceRules,
	session,
	user,
	verification
} from './schema';

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	members: many(member),
	assignedObligations: many(obligations)
}));

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

export const organisationRelations = relations(organisation, ({ one, many }) => ({
	jurisdiction: one(jurisdictions, {
		fields: [organisation.jurisdictionId],
		references: [jurisdictions.id]
	}),
	entityType: one(entityTypes, {
		fields: [organisation.entityTypeId],
		references: [entityTypes.id]
	}),
	members: many(member),
	recurrenceRules: many(recurrenceRules),
	obligations: many(obligations)
}));

export const memberRelations = relations(member, ({ one }) => ({
	organisation: one(organisation, {
		fields: [member.organisationId],
		references: [organisation.id]
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id]
	})
}));

export const jurisdictionRelations = relations(jurisdictions, ({ many }) => ({
	organisations: many(organisation)
}));

export const entityTypeRelations = relations(entityTypes, ({ many }) => ({
	organisations: many(organisation)
}));

export const recurrenceRulesRelations = relations(recurrenceRules, ({ one, many }) => ({
	organisation: one(organisation, {
		fields: [recurrenceRules.organisationId],
		references: [organisation.id]
	}),
	obligationDefinitions: many(obligationDefinitions)
}));

export const obligationDefinitionsRelations = relations(obligationDefinitions, ({ one, many }) => ({
	recurrenceRule: one(recurrenceRules, {
		fields: [obligationDefinitions.recurrenceRuleId],
		references: [recurrenceRules.id]
	}),
	obligations: many(obligations)
}));

export const obligationsRelations = relations(obligations, ({ one }) => ({
	organisation: one(organisation, {
		fields: [obligations.organisationId],
		references: [organisation.id]
	}),
	obligationDefinition: one(obligationDefinitions, {
		fields: [obligations.obligationDefinitionId],
		references: [obligationDefinitions.id]
	}),
	assignedToUser: one(user, {
		fields: [obligations.assignedToUserId],
		references: [user.id]
	})
}));
