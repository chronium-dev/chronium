import { ratingsConfig } from '$lib/config/ratings';
import { db } from '$lib/server/db';
import { member, organisation, rating, ratingReply, template, user } from '$lib/server/db/schema';
import { apiResponseSchema } from '$lib/types/api';
import {
	RatingReplyDirection,
	type Rating,
	type RatingReply,
	type RatingStatus
} from '$lib/types/ratings';
import { createId } from '$lib/utils/createid';
import { ratingReplyInputSchema } from '$lib/validations/ratings';
import { error, fail } from '@sveltejs/kit';
import { addDays } from 'date-fns';
import type { AnyColumn } from 'drizzle-orm';
import { aliasedTable, and, asc, desc, eq, gt, lt, or, sql, type SQL } from 'drizzle-orm';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 5;

// ----------------------------------------------------------------
// Schemas & Types
// ----------------------------------------------------------------

const SORTS = {
	createdAt: rating.createdAt,
	starRating: rating.starRating,
	email: rating.email // Added since we added it to the dropdown
} as const;

const SORT_OPTIONS = [
	'createdAt-desc',
	'createdAt-asc',
	'starRating-desc',
	'starRating-asc',
	'email-desc',
	'email-asc'
] as const;

type SortKey = keyof typeof SORTS;

const cursorSchema = z.object({
	value: z.union([z.string(), z.number()]),
	id: z.string()
});

const querySchema = z
	.object({
		status: z.string().optional(),
		// Validate the combined string
		sort: z.enum(SORT_OPTIONS).default('createdAt-desc'),
		after: z.string().optional(),
		before: z.string().optional()
	})
	.refine((data) => !(data.after && data.before), {
		message: 'Cannot use both "after" and "before" cursors simultaneously',
		path: ['after', 'before']
	});

export type ActiveFilters = z.infer<typeof querySchema>;

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
type CursorValueForSort<S extends SortKey> = S extends 'createdAt'
	? Date
	: S extends 'starRating'
		? number
		: string;

type CursorData<S extends SortKey> = {
	value: CursorValueForSort<S>;
	id: string;
};

function safeDecode<S extends SortKey>(
	raw: string | undefined,
	sortField: S
): CursorData<S> | null {
	if (!raw) return null;

	try {
		const json = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
		const parsed = cursorSchema.parse(json);

		if (sortField === 'createdAt') {
			return {
				id: parsed.id,
				value: new Date(parsed.value) as CursorValueForSort<S>
			};
		}

		return parsed as CursorData<S>;
	} catch {
		return null;
	}
}

function encodeCursor(row: RatingRow, sort: SortKey) {
	if (!row) return null;
	return Buffer.from(
		JSON.stringify({
			value: row[sort],
			id: row.id
		})
	).toString('base64');
}

function buildCursorWhere<S extends SortKey>(
	sortCol: AnyColumn,
	cursor: CursorData<S>,
	dir: 'asc' | 'desc'
) {
	const valueCmp = dir === 'asc' ? gt : lt;

	// 🔑 ID comparison must always move strictly "away" from the cursor
	const idCmp = dir === 'asc' ? gt : lt;

	return or(
		valueCmp(sortCol, cursor.value),
		and(eq(sortCol, cursor.value), idCmp(rating.id, cursor.id))
	);
}

// function buildRatingsQuery(args: {
// 	currentUserId: string;
// 	filters: (SQL | undefined)[];
// 	sortField: SortKey;
// 	queryDir: 'asc' | 'desc';
// }) {
// 	return db
// 		.select(ratingSelect)
// 		.from(rating)
// 		.innerJoin(template, eq(template.id, rating.templateId))
// 		.innerJoin(workspace, eq(workspace.id, template.workspaceId))
// 		.innerJoin(
// 			member,
// 			and(eq(member.workspaceId, workspace.id), eq(member.userId, args.currentUserId))
// 		)
// 		.where(args.filters.length ? and(...args.filters) : undefined)
// 		.orderBy(
// 			args.queryDir === 'asc' ? asc(SORTS[args.sortField]) : desc(SORTS[args.sortField]),
// 			args.queryDir === 'asc' ? asc(rating.id) : desc(rating.id)
// 		)
// 		.limit(PAGE_SIZE + 1);
// }

export type RatingRow = Awaited<ReturnType<typeof buildRatingsQuery>>[number];

const readByUser = aliasedTable(user, 'read_by_user');
const closedByUser = aliasedTable(user, 'closed_by_user');
// const ownerUser = aliasedTable(user, 'owner_user');
// const lastUpdatedByUser = aliasedTable(user, 'last_updated_by_user');

const ratingSelect = {
	id: rating.id,
	comment: rating.comment,
	createdAt: rating.createdAt,
	email: rating.email,
	starRating: rating.starRating,
	status: rating.status,
	templateId: rating.templateId,
	touchedAt: rating.touchedAt,
	readAt: rating.readAt,
	closedAt: rating.closedAt,
	unread: rating.unread,
	templateName: template.templateName,
	workspaceName: organisation.name,
	readByUserName: readByUser.name,
	closedByUserName: closedByUser.name
	// ownerUserName: ownerUser.name,
	// lastUpdatedByUserName: lastUpdatedByUser.name
} as const;

// const repliesSubquery = db.select().from(ratingReply).where(eq(ratingReply.ratingId, rating.id));

function buildRatingsQuery(args: {
	currentUserId: string;
	filters: (SQL | undefined)[];
	sortField: SortKey;
	queryDir: 'asc' | 'desc';
}) {
	return (
		db
			.select({
				...ratingSelect,
				replies: sql<RatingReply[]>`
					coalesce(
						json_agg(
							json_build_object(
								'id', ${ratingReply.id},
								'createdAt', ${ratingReply.createdAt},
								'updatedAt', ${ratingReply.updatedAt},
								'createdByUserId', ${ratingReply.createdByUserId},
								'unread', ${ratingReply.unread},
								'readAt', ${ratingReply.readAt},
								'readByUserId', ${ratingReply.readByUserId},
								'readByUserName', ${ratingReply.readByUserName},
								'ratingId', ${ratingReply.ratingId},
								'replyText', ${ratingReply.replyText},
								'direction', ${ratingReply.direction},
								'replyUserName',${ratingReply.replyUserName},
								'linkMessageType', ${ratingReply.linkMessageType},
								'linkEmail', ${ratingReply.linkEmail},
								'linkStatus', ${ratingReply.linkStatus},
								'linkUsed', ${ratingReply.linkUsed},
								'linkExpiresAt', ${ratingReply.linkExpiresAt},
								'linkOneTimeCode', ${ratingReply.linkOneTimeCode},
								'replyUserId', ${ratingReply.replyUserId}
								)
						) FILTER (WHERE ${ratingReply.id} IS NOT NULL),
						'[]'::json
					)
				`.as('replies')
			})
			.from(rating)

			// Required relationships
			.innerJoin(template, eq(template.id, rating.templateId))
			.innerJoin(organisation, eq(organisation.id, template.workspaceId))
			.innerJoin(
				member,
				and(eq(member.organisationId, organisation.id), eq(member.userId, args.currentUserId))
			)

			// 👇 Same table, different roles
			.leftJoin(readByUser, eq(readByUser.id, rating.readByUserId))
			.leftJoin(closedByUser, eq(closedByUser.id, rating.closedByUserId))
			// .leftJoin(ownerUser, eq(ownerUser.id, rating.ownerUserId))
			// .leftJoin(lastUpdatedByUser, eq(lastUpdatedByUser.id, rating.lastUpdatedByUserId))

			.leftJoin(ratingReply, eq(ratingReply.ratingId, rating.id))

			.where(args.filters.length ? and(...args.filters) : undefined)
			.groupBy(rating.id, template.id, organisation.id, member.id, readByUser.id, closedByUser.id)
			.orderBy(
				args.queryDir === 'asc' ? asc(SORTS[args.sortField]) : desc(SORTS[args.sortField]),
				args.queryDir === 'asc' ? asc(rating.id) : desc(rating.id)
			)
			.limit(PAGE_SIZE + 1)
	);
}

// ----------------------------------------------------------------
// Loader
// ----------------------------------------------------------------
export const load = (async ({ locals, url }) => {
	const currentUser = locals.requireUser();

	// 1. Validate Input
	const result = querySchema.safeParse(Object.fromEntries(url.searchParams));
	if (!result.success) error(400, 'Invalid query parameters');

	// result.data.sort is now "createdAt-desc", etc.
	const { status, sort: combinedSort, after, before } = result.data;

	// 2. Split the combined sort into Field and Direction
	const [sortField, urlDir] = combinedSort.split('-') as [SortKey, 'asc' | 'desc'];

	// 3. Determine Pagination Strategy
	const pagingBackward = Boolean(before);
	// const oldCursorData = oldSafeDecode(before ?? after);
	// console.log(oldCursorData);
	const cursorData = safeDecode(before ?? after, sortField);

	// Flip order if moving backward
	const queryDir = pagingBackward ? (urlDir === 'asc' ? 'desc' : 'asc') : urlDir;

	const filters: (SQL | undefined)[] = [];
	//if (status) filters.push(eq(rating.status, 'closed'));
	if (status) filters.push(eq(rating.status, status as RatingStatus));

	if (cursorData) {
		// UPDATED: Pass the split sortField here
		filters.push(buildCursorWhere(SORTS[sortField], cursorData, queryDir));
	}

	// 4. Database Query
	const ratingQuery = buildRatingsQuery({
		currentUserId: currentUser.id,
		filters,
		sortField,
		queryDir
	});

	//console.log('ratingQuery:', ratingQuery.toSQL());

	const rows: RatingRow[] = await ratingQuery;

	// 5. Post-processing
	// const hasMore = rows.length > PAGE_SIZE;
	// let page = rows.slice(0, PAGE_SIZE);

	// if (pagingBackward) {
	// 	page = page.reverse();
	// }
	let pageRows = rows;

	if (pagingBackward) {
		pageRows = rows.reverse();
	}

	const hasMore = pageRows.length > PAGE_SIZE;
	const page = pageRows.slice(0, PAGE_SIZE);

	// 6. Build Resulting Cursors
	const startRow = page[0];
	const endRow = page[page.length - 1];

	// Use 'sortField' (the column name), not 'combinedSort' (the URL string)
	const nextCursor = pagingBackward || hasMore ? encodeCursor(endRow, sortField) : null;

	const prevCursor =
		after || (pagingBackward && hasMore) ? encodeCursor(startRow, sortField) : null;

	return {
		ratings: page,
		pagination: {
			nextCursor,
			prevCursor
		},
		activeFilters: result.data
	};
}) satisfies PageServerLoad;
// }) satisfies PageServerLoad<RatingsPageData>;

export const actions = {
	saveRatingReply: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(401);

		const formData = Object.fromEntries(await request.formData());
		const validated = ratingReplyInputSchema.safeParse(formData);
		if (!validated.success) {
			// For user-fixable errors use fail()...
			const fieldErrors = z.flattenError(validated.error).fieldErrors;
			return fail(400, { fieldErrors, formData });
		}

		// // testing...
		// if (validated.success) {
		// 	return fail(400, { message: 'Some error here...', formData });
		// }

		let newReply;

		// NB: this try-catch is useless but may become useful if we
		// want to trap and handle specific expected errors.
		//
		// eslint-disable-next-line no-useless-catch
		try {
			await db.transaction(async (tx) => {
				const ratingItem: Rating | undefined = await db.query.rating.findFirst({
					where: eq(rating.id, validated.data.ratingId)
				});

				if (!ratingItem) {
					error(404, 'Rating does not exist');
				}

				// If the rating is unread and the direction is 'out' then
				// flag the rating record as 'read'. This presumes that if
				// a response email is being sent to the customer then the
				// ratings record has been read.
				if (ratingItem.unread && validated.data.direction === RatingReplyDirection.Out) {
					await tx
						.update(rating)
						.set({
							unread: false,
							readAt: new Date(),
							readByUserId: validated.data.createdByUserId,
							readByUserName: validated.data.replyUserName
						})
						.where(eq(rating.id, validated.data.ratingId));
				}

				newReply = await tx
					.insert(ratingReply)
					.values({
						...validated.data,
						linkOneTimeCode: createId(),
						linkMessageType: 'email',
						linkEmail: validated.data.email,
						linkStatus: 'pending',
						linkUsed: false,
						linkExpiresAt: addDays(new Date(), ratingsConfig.replyLinkExpiryDays),
						createdByUserId: userId
					})
					.returning();

				if (newReply.length !== 1) {
					error(500, 'Error whilst saving reply');
				}

				return { success: true };
			});

			if (!newReply) {
				error(500, 'Failed to create reply');
			}

			const newRatingsReply = newReply[0] as RatingReply;

			// Now send the email reply immediately, make the API call and wait for the response
			const response = await fetch(`${process.env.EMAIL_ENGINE_API_URL}/send-reply-to-customer`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': process.env.EMAIL_ENGINE_API_KEY!
				},
				body: JSON.stringify({ ratingsReplyId: newRatingsReply.id })
			});

			if (!response.ok) {
				error(503, 'Email service failed');
			}

			const emailResult = apiResponseSchema.parse(await response.json());
			if (!emailResult.success) {
				error(500, emailResult.message ?? 'Unable to send ratings reply email');
			}

			return { ratingReplyId: newRatingsReply.id };
		} catch (err) {
			// if (err instanceof PermissionError) {
			// 	return fail(403, { message: err.message });
			// }

			// everything else is unexpected
			throw err;
		}
	}
} satisfies Actions;
