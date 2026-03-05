import { sql } from 'drizzle-orm';
import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex
} from 'drizzle-orm/pg-core';


export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	onboarded: boolean('onboarded')
});

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		token: text('token').notNull().unique(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' })
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
	(table) => [index('account_userId_idx').on(table.userId)]
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


// export const planEnum = pgEnum('plan', ['free', 'standard', 'pro']);
export const messageOutStatus = pgEnum('message_out_status', ['pending', 'sent', 'error']);
export const ratingStatus = pgEnum('rating_status', [
	'unread-rating',
	'awaiting-customer-reply',
	'unread-customer-reply',
	'unread-rating-and-customer-reply',
	'pending-action',
	'closed'
]);
export const memberRoleEnum = pgEnum('member_role', ['owner', 'admin', 'member']);
export type MemberRoleType = (typeof memberRoleEnum.enumValues)[number];
// Create an object for convenient access
export const MemberRoleType = {
	Owner: 'owner',
	Admin: 'admin',
	Member: 'member'
} as const satisfies Record<string, MemberRoleType>;

export const workspace = pgTable('workspace', {
	id: text('id').primaryKey(),
	name: text('name'),
	logo: text('logo'),
	logoHeight: integer('logo_height'),
	logoWidth: integer('logo_width'),
	planType: integer('plan_type')
		.notNull()
		.references(() => plan.planType, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

export const member = pgTable(
	'member',
	{
		id: text('id').primaryKey(),
		workspaceId: text('workspace_id')
			.notNull()
			.references(() => workspace.id, { onDelete: 'cascade' }),
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
		uniqueIndex('members_pk').on(table.userId, table.workspaceId),
		index('workspace_member_user_id_idx').on(table.userId),
		index('workspace_member_workspace_id_idx').on(table.workspaceId)
	]
);

export const template = pgTable(
	'template',
	{
		id: text('id').primaryKey().notNull(),
		workspaceId: text('workspace_id')
			.notNull()
			.references(() => workspace.id, { onDelete: 'cascade' }),
		logoUrl: text('logo_url'),
		logoHeight: integer('logo_height'),
		logoWidth: integer('logo_width'),
		templateName: text('template_name').default('<unused>'),
		surveyTitle: text('survey_title').notNull(),
		surveyIntro: text('survey_intro').notNull(),
		surveyRatingQuestion: text('survey_rating_question').notNull(),
		surveyCommentPrompt: text('survey_comment_prompt').notNull(),
		surveyEmailPrompt: text('survey_email_prompt'),
		surveyEmailDisclaimer: text('survey_email_disclaimer'),
		thankyouLogoUrl: text('thank_you_logo_url'),
		thankyouLogoHeight: integer('thank_you_logo_height'),
		thankyouLogoWidth: integer('thank_you_logo_width'),
		thankyouTitle: text('thank_you_title').notNull(),
		thankyouText: text('thank_you_text').notNull(),
		thankyouClose: text('thank_you_close').notNull(),
		activated: boolean('activated').default(true),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [index('template_workspace_id_idx').on(table.workspaceId)]
);

export const rating = pgTable(
	'rating',
	{
		id: text('id').primaryKey().notNull(),
		comment: text('comment'),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		email: text('email'),
		starRating: integer('star_rating').notNull(),
		templateId: text('template_id').references(() => template.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
		workspaceId: text('workspace_id')
			.notNull()
			.references(() => workspace.id),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		touchedAt: timestamp('touched_at', { withTimezone: true }).defaultNow().notNull(),
		isActionable: boolean('is_actionable'),
		firstName: text('first_name'),
		lastName: text('last_name'),
		unread: boolean('unread').default(true),
		readAt: timestamp('read_at', { withTimezone: true }),
		readByUserId: text('read_by_user_id').references(() => user.id, {
			onDelete: 'cascade'
		}),
		readByUserName: text('read_by_user_name'),
		auditPayload: text('audit_payload'),
		ownerUserId: text('owner_user_id'),
		status: ratingStatus('status').default('unread-rating').notNull(),
		closedAt: timestamp('closed_at', { withTimezone: true }),
		closedByUserId: text('closed_by_user_id').references(() => user.id, {
			onDelete: 'cascade'
		}),
		closedByUserName: text('closed_by_user_name'),
		lastUpdatedByWhom: text('last_updated_by_whom'),
		lastUpdatedByUserId: text('last_updated_by_user_id').references(() => user.id, {
			onDelete: 'cascade'
		}),
		periodSequence: integer('period_sequence'),
		campaignContactId: integer('campaign_contact_id'),
		generatedForTesting: boolean('generated_for_testing').default(false),
		enSearchComment: text('en_search_comment').generatedAlwaysAs(
			sql`to_tsvector('english'::regconfig, COALESCE(comment, ''::text))`
		)
	},
	(table) => [index('rating_workspace_id_idx').on(table.workspaceId)]
);

export const ratingReply = pgTable(
	'rating_reply',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		ratingId: text('rating_id')
			.notNull()
			.references(() => rating.id, { onDelete: 'cascade' }),
		replyText: text('reply_text').notNull(),
		direction: text('direction').notNull(),
		createdByUserId: text('created_by_user_id').references(() => user.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
		replyUserName: text('reply_user_name'),
		unread: boolean('unread'),
		readAt: timestamp('read_at', { withTimezone: true }),
		readByUserId: text('read_by_user_id').references(() => user.id, { onDelete: 'cascade' }),
		readByUserName: text('read_by_user_name'),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		linkMessageType: text('link_message_type'),
		linkEmail: text('link_email'),
		linkStatus: messageOutStatus('link_status').default('pending'),
		linkUsed: boolean('link_used'),
		linkExpiresAt: timestamp('link_expires_at', { withTimezone: true }),
		linkOneTimeCode: text('link_one_time_code'),
		replyUserId: text('reply_user_id').references(() => user.id, { onDelete: 'cascade' })
	},
	(table) => [index('rating_reply_rating_id_idx').on(table.ratingId)]
);

export const plan = pgTable('plan', {
	planType: integer('plan_type').primaryKey().notNull(),
	planName: text('plan_name').notNull(),
	productIdMonthly: text('product_id_monthly').notNull(),
	productIdYearly: text('product_id_yearly').notNull(),
	productPriceMonthly: text('product_price_monthly').notNull(),
	productPriceYearly: text('product_price_yearly').notNull(),
	isActive: boolean('is_active').default(true).notNull(),
	ratingsQuotaMonthly: integer('ratings_quota_monthly').notNull(),
	ratingsQuotaYearly: integer('ratings_quota_yearly').notNull(),
	emailsQuotaMonthly: integer('emails_quota_monthly').notNull(),
	emailsQuotaYearly: integer('emails_quota_yearly').notNull(),
	membersPerOrgQuota: integer('members_per_org_quota').notNull(),
	templatesPerOrgQuota: integer('templates_per_org_quota').notNull(),
	campaignsPerOrgQuota: integer('campaigns_per_org_quota').notNull()
});

