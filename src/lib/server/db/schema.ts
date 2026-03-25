import {
	employeeCountEnum,
	vatFrequencyEnum,
	vatQuarterGroupEnum
} from '$lib/validations/organisation';
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

export { employeeCountEnum, vatFrequencyEnum, vatQuarterGroupEnum };

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

//export vatFrequencyEnum as vatFrequencyEnum from '../../../lib/validations/organisation';

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
export type MemberRole = (typeof memberRoleEnum.enumValues)[number];
export const MemberRole = {
	Owner: 'owner',
	Admin: 'admin',
	Member: 'member'
} as const satisfies Record<string, MemberRole>;

export const organisation = pgTable('organisation', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	logo: text('logo'),
	logoHeight: integer('logo_height'),
	logoWidth: integer('logo_width'),
	jurisdictionId: text('jurisdiction_id')
		.references(() => jurisdictions.id, { onDelete: 'cascade' })
		.notNull(),
	entityTypeId: text('entity_type_id')
		.references(() => entityTypes.id, { onDelete: 'cascade' })
		.notNull(),
	incorporationDate: date('incorporation_date').notNull(),
	financialYearEndMonth: integer('financial_year_end_month').notNull(), // 1–12
	financialYearEndDay: integer('financial_year_end_day').notNull(),
	vatRegistered: boolean('vat_registered').notNull(),
	vatFrequency: vatFrequencyEnum('vat_frequency'),
	// How often do they submit returns? 'quarterly' | 'monthly' | 'annual'

	vatQuarterGroup: vatQuarterGroupEnum('vat_quarter_group'),
	// If quarterly → which stagger? 'mar' | 'jan' | 'feb' (NULL if not quarterly)

	vatStartDate: date('vat_start_date'),
	// Set initially to the next VAT period end date? Optional but VERY useful for alignment

	payrollActive: boolean('payroll_active').notNull(),
	employeeCount: employeeCountEnum('employee_count'),
	businessPremises: boolean('business_premises').notNull(),
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
			.references(() => organisation.id, { onDelete: 'cascade' })
			.notNull(),
		eventTypeId: text('event_type_id')
			.references(() => eventTypes.id, { onDelete: 'cascade' })
			.notNull(),
		anchorDate: date('anchor_date', { mode: 'date' }),
		eventDate: date('event_date', { mode: 'date' }).notNull(),
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
			.references(() => obligationTypes.id, { onDelete: 'cascade' })
			.notNull(),
		triggerEventTypeId: text('trigger_event_type_id')
			.references(() => eventTypes.id, { onDelete: 'cascade' })
			.notNull(),
		jurisdictionId: text('jurisdiction_id').references(() => jurisdictions.id),
		entityTypeId: text('entity_type_id').references(() => entityTypes.id),
		dueOffsetMonths: integer('due_offset_months').notNull().default(0),
		dueOffsetDays: integer('due_offset_days').notNull().default(0),
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
			.references(() => organisation.id, { onDelete: 'cascade' })
			.notNull(),
		obligationTypeId: text('obligation_type_id')
			.references(() => obligationTypes.id, { onDelete: 'cascade' })
			.notNull(),
		templateId: text('template_id').references(() => obligationTemplates.id),
		generatedFromEventId: text('generated_from_event_id').references(() => events.id),
		dueDate: date('due_date', { mode: 'date' }).notNull(),
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
			.notNull()
			.references(() => organisation.id, { onDelete: 'cascade' }),
		eventTypeId: text('event_type_id')
			.references(() => eventTypes.id, { onDelete: 'cascade' })
			.notNull(),
		name: text('name').notNull(),
		startDate: date('start_date', { mode: 'date' }).notNull(),
		endDate: date('end_date', { mode: 'date' }),
		frequency: recurrenceFrequencyEnum('frequency').notNull(),
		interval: integer('interval').default(1).notNull(),
		weekDay: integer('weekday'),
		// optional (0-6)
		monthDay: integer('month_day'),
		month: integer('month'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [uniqueIndex('recurrence_rule_unique').on(table.organisationId, table.eventTypeId)]
);
