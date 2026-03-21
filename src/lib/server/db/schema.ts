import {
	boolean,
	date,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { createId } from '../../../lib/utils/createid';

export const obligationStatusEnum = pgEnum('obligation_status', [
	'pending',
	'completed',
	'skipped',
	'cancelled'
]);
export type ObligationStatusType = (typeof obligationStatusEnum.enumValues)[number];
export const ObligationStatusType = {
	Pending: 'pending',
	Complated: 'completed',
	Skipped: 'skipped',
	Cancelled: 'cancelled'
} as const satisfies Record<string, ObligationStatusType>;

export const recurrenceFrequencyEnum = pgEnum('recurrence_frequency', [
	'daily',
	'weekly',
	'monthly',
	'yearly'
]);
export type RecurrenceFrequencyType = (typeof recurrenceFrequencyEnum.enumValues)[number];
export const RecurrenceFrequencyType = {
	Monthly: 'monthly',
	Yearly: 'yearly'
} as const satisfies Record<string, RecurrenceFrequencyType>;

export const domainEnum = pgEnum('obligation_domain', ['statutory', 'operational', 'governance']);
export type DomainType = (typeof domainEnum.enumValues)[number];
export const DomainType = {
	Statutory: 'statutory',
	Operational: 'operational',
	Governance: 'governance'
} as const satisfies Record<string, DomainType>;

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	onboarded: boolean('onboarded'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		token: text('token').notNull().unique(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index('account_userId_idx').on(table.userId),
		uniqueIndex('provider_account_unique').on(table.providerId, table.accountId)
	]
);

export const verification = pgTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const memberRoleEnum = pgEnum('member_role', ['owner', 'admin', 'member']);
export type MemberRoleType = (typeof memberRoleEnum.enumValues)[number];

export const organisation = pgTable('organisation', {
	id: text('id').primaryKey(),
	name: text('name'),
	logo: text('logo'),
	logoHeight: integer('logo_height'),
	logoWidth: integer('logo_width'),
	jurisdictionId: text('jurisdiction_id')
		.references(() => jurisdictions.id)
		.notNull(),
	entityTypeId: text('entity_type_id')
		.references(() => entityTypes.id)
		.notNull(),
	incorporationDate: date('incorporation_date').notNull(),
	financialYearEnd: date('financial_year_end').notNull(),
	vatRegistered: text('vat_registered').notNull(),
	payrollActive: text('payroll_active').notNull(),
	employeeCount: text('employee_count'),
	businessPremises: text('business_premises').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const member = pgTable(
	'member',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		organisationId: text('organisation_id')
			.notNull()
			.references(() => organisation.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		role: memberRoleEnum('role').default('member').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		// Ensure a user can only have one membership record per workspace
		uniqueIndex('members_pk').on(table.userId, table.organisationId),
		index('member_user_id_idx').on(table.userId),
		index('member_organisation_id_idx').on(table.organisationId)
	]
);

/**
 * These represent things that happened.
 */
export const events = pgTable(
	'events',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		organisationId: text('organisation_id')
			.references(() => organisation.id)
			.notNull(),
		eventTypeId: text('event_type_id')
			.references(() => eventTypes.id)
			.notNull(),
		anchorDate: date('anchor_date'),
		eventDate: date('event_date').notNull(),
		generated: boolean('generated').default(true),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index('events_event_type_idx').on(table.eventTypeId),
		uniqueIndex('events_unique').on(table.organisationId, table.eventTypeId, table.eventDate)
	]
);

/**
 * This is where rules live.
 */
export const obligationTemplates = pgTable(
	'obligation_templates',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		name: text('name').notNull(),
		obligationTypeId: text('obligation_type_id')
			.references(() => obligationTypes.id)
			.notNull(),
		triggerEventTypeId: text('trigger_event_type_id')
			.references(() => eventTypes.id)
			.notNull(),
		jurisdictionId: text('jurisdiction_id').references(() => jurisdictions.id),
		entityTypeId: text('entity_type_id').references(() => entityTypes.id),
		dueOffsetDays: integer('due_offset_days').notNull(),
		defaultNotes: text('default_notes'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index('obligation_templates_trigger_event_idx').on(table.triggerEventTypeId),
		uniqueIndex('obligation_template_rule_unique').on(
			table.triggerEventTypeId,
			table.obligationTypeId,
			table.jurisdictionId,
			table.entityTypeId
		)
	]
);

/**
 * Generated obligations.
 */
export const obligations = pgTable(
	'obligations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		organisationId: text('organisation_id')
			.references(() => organisation.id)
			.notNull(),
		obligationTypeId: text('obligation_type_id')
			.references(() => obligationTypes.id)
			.notNull(),
		templateId: text('template_id').references(() => obligationTemplates.id),
		generatedFromEventId: text('generated_from_event_id').references(() => events.id),
		dueDate: date('due_date').notNull(),
		status: obligationStatusEnum('status').default('pending').notNull(),
		userNotes: text('user_notes'),
		generated: boolean('generated').default(true),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [
		index('obligations_organisation_idx').on(table.organisationId),
		uniqueIndex('obligation_generation_event_Id_unique').on(
			table.generatedFromEventId,
			table.templateId
		),
		uniqueIndex('obligation_generation_event_obligation_unique').on(
			table.generatedFromEventId,
			table.obligationTypeId
		)
	]
);

export const eventTypes = pgTable(
	'event_types',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		key: text('key').notNull().unique(),
		name: text('name').notNull(),
		description: text('description'),
		domain: domainEnum('domain').notNull(),
		organisationId: text('organisation_id').references(() => organisation.id),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [uniqueIndex('event_type_key_org_id_unique').on(table.key, table.organisationId)]
);

export const obligationTypes = pgTable('obligation_types', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	key: text('key').unique().notNull(),
	name: text('name').notNull(),
	description: text('description'),
	domain: domainEnum('domain').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const jurisdictions = pgTable('jurisdictions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	key: text('key').unique().notNull(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const entityTypes = pgTable('entity_types', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	key: text('key').unique().notNull(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

// {
// 		eventTypeKey: 'board_meeting_held',
// 		organisationId: organisationSeeds[0].id,
// 		name: 'Quarterly Board Meeting',
// 		frequency: 'monthly',
// 		interval: 3
// 	},

export const recurrenceRules = pgTable(
	'recurrence_rules',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		organisationId: text('organisation_id')
			.references(() => organisation.id)
			.notNull(),
		eventTypeId: text('event_type_id')
			.references(() => eventTypes.id)
			.notNull(),
		name: text('name').notNull(),
		startDate: date('start_date').notNull(),
		endDate: date('end_date'),
		frequency: recurrenceFrequencyEnum('frequency').notNull(),
		interval: integer('interval').default(1).notNull(),
		weekday: integer('weekday'),
		// optional (0-6)
		monthDay: integer('month_day'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [uniqueIndex('recurrence_rule_unique').on(table.organisationId, table.eventTypeId)]
);
