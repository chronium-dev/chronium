import { relations } from 'drizzle-orm';
import {
	account,
	entityTypes,
	eventTypes,
	events,
	jurisdictions,
	member,
	obligationTemplates,
	obligationTypes,
	obligations,
	organisation,
	recurrenceRules,
	session,
	user
} from './schema';

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
	accounts: many(account),
	members: many(member),
	assignedObligations: many(obligations)
}));

export const organisationRelations = relations(organisation, ({ one, many }) => ({
	members: many(member),
	events: many(events),
	eventTypes: many(eventTypes),
	obligations: many(obligations),
	recurrenceRules: many(recurrenceRules),
	jurisdiction: one(jurisdictions, {
		fields: [organisation.jurisdictionId],
		references: [jurisdictions.id]
	}),
	entityType: one(entityTypes, {
		fields: [organisation.entityTypeId],
		references: [entityTypes.id]
	})
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

export const eventTypeRelations = relations(eventTypes, ({ one, many }) => ({
	organisation: one(organisation, {
		fields: [eventTypes.organisationId],
		references: [organisation.id]
	}),
	events: many(events),
	obligationTemplates: many(obligationTemplates),
	recurrenceRules: many(recurrenceRules)
}));

export const eventRelations = relations(events, ({ one, many }) => ({
	organisation: one(organisation, {
		fields: [events.organisationId],
		references: [organisation.id]
	}),
	eventType: one(eventTypes, {
		fields: [events.eventTypeId],
		references: [eventTypes.id]
	}),
	generatedObligations: many(obligations)
}));

export const obligationTypeRelations = relations(obligationTypes, ({ many }) => ({
	obligations: many(obligations),
	obligationTemplates: many(obligationTemplates)
}));

export const obligationTemplateRelations = relations(obligationTemplates, ({ one, many }) => ({
	eventType: one(eventTypes, {
		fields: [obligationTemplates.triggerEventTypeId],
		references: [eventTypes.id]
	}),
	obligationType: one(obligationTypes, {
		fields: [obligationTemplates.obligationTypeId],
		references: [obligationTypes.id]
	}),
	jurisdiction: one(jurisdictions, {
		fields: [obligationTemplates.jurisdictionId],
		references: [jurisdictions.id]
	}),
	entityType: one(entityTypes, {
		fields: [obligationTemplates.entityTypeId],
		references: [entityTypes.id]
	}),
	obligations: many(obligations)
}));

export const obligationRelations = relations(obligations, ({ one }) => ({
	organisation: one(organisation, {
		fields: [obligations.organisationId],
		references: [organisation.id]
	}),
	obligationType: one(obligationTypes, {
		fields: [obligations.obligationTypeId],
		references: [obligationTypes.id]
	}),
	template: one(obligationTemplates, {
		fields: [obligations.templateId],
		references: [obligationTemplates.id]
	}),
	generatedFromEvent: one(events, {
		fields: [obligations.generatedFromEventId],
		references: [events.id]
	}),
	assignedToUser: one(user, {
		fields: [obligations.assignedToUserId],
		references: [user.id]
	})
}));

export const jurisdictionRelations = relations(jurisdictions, ({ many }) => ({
	organisations: many(organisation),
	obligationTemplates: many(obligationTemplates)
}));

export const entityTypeRelations = relations(entityTypes, ({ many }) => ({
	organisations: many(organisation),
	obligationTemplates: many(obligationTemplates)
}));

export const recurrenceRuleRelations = relations(recurrenceRules, ({ one }) => ({
	organisation: one(organisation, {
		fields: [recurrenceRules.organisationId],
		references: [organisation.id]
	}),
	eventType: one(eventTypes, {
		fields: [recurrenceRules.eventTypeId],
		references: [eventTypes.id]
	})
}));
