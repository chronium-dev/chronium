import { env } from '$env/dynamic/private';
import type { RatingsConfig } from '$lib/types/ratings';

export const ratingsConfig: RatingsConfig = {
	replyLinkExpiryDays: 7,
	senderEmailAddress: env.EMAIL_FROM_ADDRESS
};
