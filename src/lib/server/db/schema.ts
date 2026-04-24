import {
	employeeCountEnum,
	payeFrequencyEnum,
	vatFrequencyEnum
} from '$lib/validations/organisation';
import { UTCDate } from '@date-fns/utc';
import {
	boolean,
	date,
	foreignKey,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { createId } from '../../../lib/utils/createid';

export { employeeCountEnum, payeFrequencyEnum, vatFrequencyEnum };

export const obligationStatusEnum = pgEnum('obligation_status', [
	'pending',
	'completed',
	'skipped',
	'cancelled'
]);
export type ObligationStatusType = (typeof obligationStatusEnum.enumValues)[number];
export const ObligationStatusType = {
	Pending: 'pending',
	Completed: 'completed',
	Skipped: 'skipped',
	Cancelled: 'cancelled'
} as const satisfies Record<string, ObligationStatusType>;

export const recurrenceFrequencyEnum = pgEnum('recurrence_frequency', [
	'weekly',
	'monthly',
	'quarterly',
	'yearly'
]);
export type RecurrenceFrequencyType = (typeof recurrenceFrequencyEnum.enumValues)[number];
export const RecurrenceFrequencyType = {
	Weekly: 'weekly',
	Monthly: 'monthly',
	Quarterly: 'quarterly',
	Yearly: 'yearly'
} as const satisfies Record<string, RecurrenceFrequencyType>;

export const obligationCategoryEnum = pgEnum('obligation_category', [
	'statutory',
	'operational',
	'governance'
]);
export type ObligationCategoryType = (typeof obligationCategoryEnum.enumValues)[number];
export const ObligationCategoryType = {
	Statutory: 'statutory',
	Operational: 'operational',
	Governance: 'governance'
} as const satisfies Record<string, ObligationCategoryType>;

export const obligationSourceEnum = pgEnum('obligation_source', ['system', 'user']);

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	onboarded: boolean('onboarded'),
	defaultOrgId: text('default_org_id'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new UTCDate())
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
			.$onUpdate(() => new UTCDate())
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
			.$onUpdate(() => new UTCDate())
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
			.$onUpdate(() => new UTCDate())
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
	financialYearEndIsLastDay: boolean('financial_year_end_is_last_day').notNull().default(false),
	vatRegistered: boolean('vat_registered').notNull(),
	vatFrequency: vatFrequencyEnum('vat_frequency'),
	// How often do they submit returns? 'quarterly' | 'monthly' | 'annual'

	vatEndDate: date('vat_end_date'),
	// Set initially to the next VAT period end date? Optional but VERY useful for alignment

	payrollActive: boolean('payroll_active').notNull(),
	payeFrequency: payeFrequencyEnum('paye_frequency'),
	employeeCount: employeeCountEnum('employee_count'),
	businessPremises: boolean('business_premises').notNull(),
	obligationsGeneratedTo: date('obligation_generation_to'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new UTCDate())
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
			.$onUpdate(() => new UTCDate())
			.notNull()
	},
	(table) => [
		// Ensure a user can only have one membership record per workspace
		uniqueIndex('members_pk').on(table.userId, table.organisationId),
		index('member_user_id_idx').on(table.userId),
		index('member_organisation_id_idx').on(table.organisationId)
	]
);

export const obligationTemplates = pgTable(
	'obligation_templates',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		key: text('key').notNull(), // e.g. 'annual_accounts'
		name: text('name').notNull(), // e.g. 'Annual Accounts'
		category: obligationCategoryEnum('category').notNull(),
		isSystem: boolean('is_system').default(true),
		defaultFrequency: recurrenceFrequencyEnum('default_frequency'),
		defaultValue: integer('default_value'),
		description: text('description'),
		penalties: text('penalties'),
		eventLabel: text('event_label'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new UTCDate())
			.notNull()
	},
	(table) => [uniqueIndex('obligation_templates_key_unique').on(table.key)]
);

/**
 * Join table between organisation and onligationTemplates
 */
export const organisationObligationSettings = pgTable(
	'organisation_obligation_settings',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		key: text('key').notNull(), // Just for query convenience - e.g. 'annual_accounts' (not really required)
		organisationId: text('organisation_id').notNull(),
		obligationTemplateId: text('obligation_template_id').notNull(),
		enabled: boolean('enabled').notNull().default(true),
		frequency: recurrenceFrequencyEnum('frequency'),
		interval: integer('interval').notNull().default(1),
		anchorDate: date('anchor_date'),
		dayOfMonth: integer('day_of_month'),
		monthOfYear: integer('month_of_year'),
		endOfMonth: boolean('end_of_month').default(false),
		customName: text('custom_name'),
		configured: boolean('configured').notNull().default(false), // user has completed recurrence setup
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new UTCDate())
			.notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.organisationId],
			foreignColumns: [organisation.id],
			name: 'fk_org_obligation_settings_organisation'
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.obligationTemplateId],
			foreignColumns: [obligationTemplates.id],
			name: 'fk_org_obligation_settings_template'
		}).onDelete('cascade'),

		uniqueIndex('org_obligation_settings_unique').on(
			table.organisationId,
			table.obligationTemplateId
		),
		uniqueIndex('org_obligation_settings_key_unique').on(table.organisationId, table.key)
	]
);

/**
 * A concrete, dated occurrence of an obligation.
 * Produced by both generators; stored in a single unified table.
 */
export const obligations = pgTable(
	'obligations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => createId()),
		organisationId: text('organisation_id').notNull(),
		organisationObligationSettingId: text('organisation_obligation_setting_id').notNull(),
		dueDate: date('due_date').notNull(),
		eventDate: date('event_date'),
		status: obligationStatusEnum('status').notNull().default('pending'),
		assignedToUserId: text('assigned_to_user_id').references(() => user.id),
		notes: text('notes'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new UTCDate())
			.notNull()
	},
	(table) => [
		foreignKey({
			columns: [table.organisationId],
			foreignColumns: [organisation.id],
			name: 'fk_obligations_organisation_fk'
		}).onDelete('cascade'),
		foreignKey({
			columns: [table.organisationObligationSettingId],
			foreignColumns: [organisationObligationSettings.id],
			name: 'fk_obligations_settings_fk'
		}).onDelete('cascade'),
		uniqueIndex('unique_obligation_instance').on(
			table.organisationId,
			table.organisationObligationSettingId,
			table.dueDate
		),
		index('obligations_due_date_idx').on(table.dueDate)
	]
);

export const jurisdictions = pgTable('jurisdictions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	key: text('key').unique().notNull(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new UTCDate())
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
		.$onUpdate(() => new UTCDate())
		.notNull()
});
