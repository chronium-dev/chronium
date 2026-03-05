import { throwAppError } from '$lib/server/app-error';
import { db } from '$lib/server/db';
import { rating, ratingReply } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { code } = params;
	console.log('code:', code);

	try {
		const ratingReplyItem = await db.query.ratingReply.findFirst({
			where: and(eq(ratingReply.linkOneTimeCode, code), eq(ratingReply.direction, 'out'))
		});

		const test = await db.query.rating.findFirst({
			with: {
				templateRelation: true,
				replies: true
			}
		});

		console.log(test); // Does templateRelation exist at runtime?
		console.log(test?.templateRelation); // What does this log?

		if (!ratingReplyItem) {
			throwAppError(404, 'This reply link is invalid.', 'REPLY_CODE_NOT_FOUND');
		}

		if (ratingReplyItem.linkUsed) {
			throwAppError(410, 'This reply link has already been used.', 'REPLY_CODE_USED');
		}

		if (ratingReplyItem.linkExpiresAt && ratingReplyItem.linkExpiresAt < new Date()) {
			throwAppError(410, 'This reply link has expired.', 'REPLY_CODE_EXPIRED');
		}

		// const test = await db.query.rating.findFirst({
		// 	with: {
		// 		templateRelation: true
		// 	}
		// });

		// const test2 = await db.query.rating.findFirst({
		// 	with: {
		// 		replies: true,
		// 		templateRelation: true
		// 	} as const,
		// });

		const ratingItem = await db.query.rating.findFirst({
			where: eq(rating.id, ratingReplyItem.ratingId), // adjust your where clause
			with: {
				replies: true, // returns as array
				templateRelation: {
					with: {
						workspace: true
					}
				}
			}
		});

		// Type Guard...
		if (!ratingItem) {
			throwAppError(404, 'This reply link is invalid.', 'REPLY_CODE_NOT_FOUND');
		}

		return {
			ratingItem,
			oneTimeCode: code
		};
	} catch {
		throwAppError(500, 'An error has occurred.');
	}
};
