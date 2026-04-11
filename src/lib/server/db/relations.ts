import { relations } from 'drizzle-orm';
import {
	account,
	entityTypes,
	jurisdictions,
	member,
	obligations,
	obligationTemplates,
	organisation,
	organisationObligationSettings,
	session,
	user
} from './schema';

// ─── User ────────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	members: many(member),
	assignedObligations: many(obligations)
}));

// ─── Session ─────────────────────────────────────────────────────────────────

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

// ─── Account ─────────────────────────────────────────────────────────────────

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));

// ─── Verification ─────────────────────────────────────────────────────────────
// No FK relations — verification rows are keyed by identifier (e.g. email),
// not a hard foreign key to user. No relations needed.

// ─── Organisation ─────────────────────────────────────────────────────────────

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
	obligationSettings: many(organisationObligationSettings),
	obligations: many(obligations)
}));

// ─── Member ───────────────────────────────────────────────────────────────────

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

// ─── Jurisdiction ─────────────────────────────────────────────────────────────

export const jurisdictionRelations = relations(jurisdictions, ({ many }) => ({
	organisations: many(organisation)
}));

// ─── EntityType ───────────────────────────────────────────────────────────────

export const entityTypeRelations = relations(entityTypes, ({ many }) => ({
	organisations: many(organisation)
}));

// ─── ObligationTemplate ───────────────────────────────────────────────────────

export const obligationTemplateRelations = relations(obligationTemplates, ({ many }) => ({
	organisationSettings: many(organisationObligationSettings)
}));

// ─── OrganisationObligationSettings ──────────────────────────────────────────

export const organisationObligationSettingsRelations = relations(
	organisationObligationSettings,
	({ one, many }) => ({
		organisation: one(organisation, {
			fields: [organisationObligationSettings.organisationId],
			references: [organisation.id]
		}),
		template: one(obligationTemplates, {
			fields: [organisationObligationSettings.obligationTemplateId],
			references: [obligationTemplates.id]
		}),
		obligations: many(obligations)
	})
);

// ─── Obligation ───────────────────────────────────────────────────────────────

export const obligationRelations = relations(obligations, ({ one }) => ({
	organisation: one(organisation, {
		fields: [obligations.organisationId],
		references: [organisation.id]
	}),
	setting: one(organisationObligationSettings, {
		fields: [obligations.organisationObligationSettingId],
		references: [organisationObligationSettings.id]
	}),
	assignedTo: one(user, {
		fields: [obligations.assignedToUserId],
		references: [user.id]
	})
}));
