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

		if (!ratingReplyItem) {
			throwAppError(404, 'This reply link is invalid.', 'REPLY_CODE_NOT_FOUND');
		}

		const ratingItem = await db.query.rating.findFirst({
			where: eq(rating.id, ratingReplyItem.ratingId),
			with: {
				template: true
			}
		});

		// Type Guard...
		if (!ratingItem) {
			throwAppError(404, 'This reply link is invalid.', 'REPLY_CODE_NOT_FOUND');
		}

		return {
			rating: ratingItem
		};
	} catch {
		throwAppError(500, 'An error has occurred.');
	}
};
