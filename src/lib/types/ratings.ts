// export type RatingListRow = {
// 	id: string;
// 	comment: string;
// 	createdAt: string;
// 	email: string;
// 	starRating: string;
// 	templateId: string;
// 	status: string;
// };

import type { rating, ratingReply, ratingStatus } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export const RatingStatus = {
	UnreadRating: 'unread-rating',
	AwaitingCustomerReply: 'awaiting-customer-reply',
	UnreadCustomerReply: 'unread-customer-reply',
	UnreadRatingAndCustomerReply: 'unread-rating-and-customer-reply',
	PendingAction: 'pending-action',
	Closed: 'closed'
} as const;

export function getRatingLabelFromStatus(status: string) {
	if (status === RatingStatus.UnreadRating.toString()) return 'Unread Rating';
	if (status === RatingStatus.AwaitingCustomerReply.toString()) return 'Awaiting Customer Reply';
	if (status === RatingStatus.UnreadCustomerReply.toString()) return 'Unread Customer Reply';
	if (status === RatingStatus.UnreadRatingAndCustomerReply.toString())
		return 'Unread Rating and Customer Reply';
	if (status === RatingStatus.PendingAction.toString()) return 'Pending Action';
	if (status === RatingStatus.Closed.toString()) return 'Closed';
	return undefined;
}

export type RatingStatus = (typeof ratingStatus.enumValues)[number];

export enum RatingReplyDirection {
	Out = 'out',
	In = 'in'
}

export type RatingReply = InferSelectModel<typeof ratingReply>;
export type Rating = InferSelectModel<typeof rating>;

export type RatingsConfig = {
	replyLinkExpiryDays: number;
	senderEmailAddress?: string;
};

export enum LoadReplyCodeResultType {
	success,
	errorGeneric,
	errorExpired,
	errorUsed,
	errorNotExists
}
