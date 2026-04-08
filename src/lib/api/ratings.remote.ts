import { command, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { rating, ratingReply } from '$lib/server/db/schema';
import { RatingStatus } from '$lib/types/ratings';
import {
	ratingIdSchema,
	ratingReplyUserStampSchema,
	userStampRatingSchema
} from '$lib/validations/ratings';
import { error } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';

export const markRatingAsRead = command(userStampRatingSchema, async (params) => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		error(401, 'User not authenticated');
	}

	await db
		.update(rating)
		.set({
			unread: false,
			readAt: new UTCDate(),
			readByUserName: params.userName,
			readByUserId: params.userId,
			lastUpdatedByWhom: params.userName
		})
		.where(eq(rating.id, params.id));

	return { success: true };
});

export const markRatingAsUnread = command(ratingIdSchema, async (params) => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		error(401, 'User not authenticated');
	}

	await db
		.update(rating)
		.set({
			unread: true,
			readAt: null,
			readByUserName: null,
			readByUserId: null,
			lastUpdatedByWhom: null
		})
		.where(eq(rating.id, params.id));

	return { success: true };
});

export const markRatingAsClosed = command(userStampRatingSchema, async (params) => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		error(401, 'User not authenticated');
	}

	await db
		.update(rating)
		.set({
			status: RatingStatus.Closed,
			closedAt: new UTCDate(),
			closedByUserId: params.userId,
			closedByUserName: params.userName,
			lastUpdatedByWhom: params.userName
		})
		.where(eq(rating.id, params.id));

	return { success: true };
});

// export const resetRatingStatus = command(userStampRatingSchema, async (params) => {
// 	const { locals } = getRequestEvent();
// 	if (!locals.user) {
// 		error(401, 'User not authenticated');
// 	}

// 	// await db.execute(
// 	// 	sql`SELECT public.reset_rating_status(${params.id}, ${params.userName}, ${params.userId})`
// 	// );

// 	const { id: ratingId, userName: byWhom, userId: byUserId } = params;

// 	const result = await db.transaction(async (tx) => {
// 		// 1. Fetch latest reply + unread flags
// 		const row = await tx
// 			.select({
// 				ratingUnread: rating.unread,
// 				direction: ratingReply.direction,
// 				replyUnread: ratingReply.unread,
// 				ratingId: rating.id
// 			})
// 			.from(rating)
// 			.leftJoin(ratingReply, eq(rating.id, ratingReply.ratingId))
// 			.where(eq(rating.id, ratingId))
// 			.orderBy(desc(ratingReply.createdAt))
// 			.limit(1)
// 			.then((rows) => rows[0]);

// 		if (!row) {
// 			throw new Error(`Rating ${ratingId} not found`);
// 		}

// 		const { ratingUnread, direction, replyUnread } = row;

// 		// 2. Update rating status using CASE (kept in SQL for parity)
// 		await tx
// 			.update(rating)
// 			.set({
// 				status: sql`
//           CASE
//             WHEN ${ratingUnread} = TRUE AND ${replyUnread} = TRUE
//               THEN 'unread-rating-and-customer-reply'::rating_status
//             WHEN ${ratingUnread} = TRUE
//               THEN 'unread-rating'::rating_status
//             WHEN ${direction} = 'in' AND ${replyUnread} = TRUE
//               THEN 'unread-customer-reply'::rating_status
//             WHEN ${direction} IS NULL AND ${replyUnread} = FALSE
//               THEN 'pending-action'::rating_status
//             WHEN ${direction} IS NULL AND ${replyUnread} IS NULL
//               THEN 'pending-action'::rating_status
//             WHEN ${direction} = 'in' AND ${replyUnread} = FALSE
//               THEN 'pending-action'::rating_status
//             WHEN ${direction} = 'out'
//               THEN 'awaiting-customer-reply'::rating_status
//           END
//         `,
// 				updatedAt: sql`now()`,
// 				touchedAt: sql`now()`,
// 				closedAt: null,
// 				closedByUserId: null,
// 				closedByUserName: null,
// 				lastUpdatedByWhom: byWhom,
// 				lastUpdatedByUserId: byUserId
// 			})
// 			.where(eq(rating.id, ratingId));

// 		return true;
// 	});

// 	console.log('resetRatingStatusAction result:', result);

// 	return { success: true };
// });

export const resetRatingStatus = command(userStampRatingSchema, async (params) => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		error(401, 'User not authenticated');
	}

	try {
		await db.transaction(async (tx) => {
			// Fetch rating and latest reply data
			const result = await tx
				.select({
					ratingUnread: rating.unread,
					direction: ratingReply.direction,
					replyUnread: ratingReply.unread,
					id: rating.id
				})
				.from(rating)
				.leftJoin(ratingReply, eq(rating.id, ratingReply.ratingId))
				.where(eq(rating.id, params.id))
				.orderBy(desc(ratingReply.createdAt))
				.limit(1);

			if (result.length === 0) {
				error(404, 'Rating not found');
			}

			const { ratingUnread, direction, replyUnread } = result[0];

			// Determine the new status based on conditions
			let newStatus: string;

			if (ratingUnread && replyUnread) {
				newStatus = 'unread-rating-and-customer-reply';
			} else if (ratingUnread) {
				newStatus = 'unread-rating';
			} else if (direction === 'in' && replyUnread === true) {
				newStatus = 'unread-customer-reply';
			} else if (direction === null && replyUnread === false) {
				newStatus = 'pending-action';
			} else if (direction === null && replyUnread === null) {
				newStatus = 'pending-action';
			} else if (direction === 'in' && replyUnread === false) {
				newStatus = 'pending-action';
			} else if (direction === 'out') {
				newStatus = 'awaiting-customer-reply';
			} else {
				newStatus = 'pending-action'; // default fallback
			}

			// Update the rating
			await tx
				.update(rating)
				.set({
					status: newStatus as RatingStatus,
					updatedAt: new UTCDate(),
					touchedAt: new UTCDate(),
					closedAt: null,
					closedByUserId: null,
					closedByUserName: null,
					lastUpdatedByWhom: params.userName,
					lastUpdatedByUserId: params.userId
				})
				.where(eq(rating.id, params.id));

			return true;
		});
	} catch (error) {
		console.error('Error in resetRatingStatus:', error);
		throw error;
	}
});

export const markRatingReplyAsRead = command(ratingReplyUserStampSchema, async (params) => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		error(401, 'User not authenticated');
	}

	await db
		.update(ratingReply)
		.set({
			unread: false,
			readAt: new UTCDate(),
			readByUserName: params.userName,
			readByUserId: params.userId,
			replyUserName: params.userName,
			replyUserId: params.userId
		})
		.where(eq(ratingReply.id, params.id));

	return { success: true };
});

// export const createNewRatingReply = command(
// 	ratingReplyInputSchema,
// 	async (params): Promise<{ replyId: number }> => {
// 		const { locals } = getRequestEvent();
// 		if (!locals.user) {
// 			error(401, 'User not authenticated');
// 		}

// 		let newReply!: RatingReply;

// 		await db.transaction(async (tx) => {
// 			const ratingItem: Rating | undefined = await db.query.rating.findFirst({
// 				where: eq(rating.id, params.ratingId)
// 			});

// 			if (!ratingItem) {
// 				throw new Error('Rating does not exist');
// 			}

// 			// If the rating is unread and the direction is 'out' then
// 			// flag the rating record as 'read'. This presumes that if
// 			// a response email is being sent to the customer then the
// 			// ratings record has been read.
// 			if (ratingItem.unread && params.direction === RatingReplyDirection.Out) {
// 				await tx
// 					.update(rating)
// 					.set({
// 						unread: false,
// 						readAt: new Date(),
// 						readByUserId: params.createdByUserId,
// 						readByUserName: params.replyUserName
// 					})
// 					.where(eq(rating.id, params.ratingId));
// 			}

// 			const inserted = await tx
// 				.insert(ratingReply)
// 				.values({
// 					...params,
// 					linkOneTimeCode: createId(),
// 					linkMessageType: 'email',
// 					linkEmail: params.email,
// 					linkStatus: 'pending',
// 					linkUsed: false,
// 					linkExpiresAt: addDays(new Date(), ratingsConfig.replyLinkExpiryDays),
// 					createdByUserId: locals.user?.id
// 				})
// 				.returning();

// 			if (inserted.length !== 1) {
// 				throw error(500, 'Failed to create reply');
// 			}

// 			newReply = inserted[0];
// 		});

// 		// Now send the email reply immediately, make the API call and wait for the response
// 		const response = await fetch(`${process.env.EMAIL_ENGINE_API_URL!}/send-reply-to-customer`, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 				'x-api-key': process.env.EMAIL_ENGINE_API_KEY!
// 			},
// 			body: JSON.stringify({ ratingsReplyId: newReply.id })
// 		});

// 		if (!response.ok) {
// 			throw error(502, 'Email service failed');
// 		}

// 		const emailResult = apiResponseSchema.parse(await response.json());
// 		if (!emailResult.success) {
// 			throw error(502, emailResult.message ?? 'Unable to send ratings reply email');
// 		}

// 		return { replyId: newReply.id };
// 	}
// );
