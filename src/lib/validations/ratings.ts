import { RatingReplyDirection } from '$lib/types/ratings';
import z from 'zod';

export const ratingInputSchema = z.object({
	comment: z
		.union([z.string(), z.undefined()])
		.nullable()
		.transform((value) => (value === '' ? undefined : value)),
	// The following rule allows for a blank email, but if not blank
	// then the input value must be a valid email address
	email: z.union([
		z.email({ message: 'Please enter a valid email address' }), // If provided must be valid email address
		z.string().max(0),
		z.null(),
		z.undefined()
	]),
	starRating: z.coerce.number().int().min(1, 'Please select a Star Rating').max(5),
	templateId: z.string(),
	workspaceId: z.string()
});

export const ratingIdSchema = z.object({
	id: z.string()
});

export const userStampRatingSchema = z.object({
	id: z.string(),
	userId: z.string(),
	userName: z.string()
});

export const ratingReplyUserStampSchema = z.object({
	id: z.number(),
	userId: z.string(),
	userName: z.string()
});

export const ratingReplyInputSchema = z.object({
	replyText: z.string().min(1, 'Reply should not be blank'),
	ratingId: z.string(),
	createdByUserId: z.string(),
	replyUserName: z.string(),
	direction: z.enum(RatingReplyDirection),
	email: z.string()
});
