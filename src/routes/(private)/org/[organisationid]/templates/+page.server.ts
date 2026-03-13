import { db } from '$lib/server/db';
import { member, organisation, template } from '$lib/server/db/schema';
import { changeFileExtension } from '$lib/utils/filenames';
import { deleteFileFromUploadthing } from '$lib/utils/uploadthing';
import { error, fail } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import sharp from 'sharp';
import { UTApi } from 'uploadthing/server';
import type { PageServerLoad } from './$types';

// Initialize the UploadThing API
const utapi = new UTApi();

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) error(401);

	// For now there should only ever be one template per user
	// even though the database structure allows for any number
	// of workspaces and templates.
	const result = await db
		.select({
			template: template
		})
		.from(template)
		.innerJoin(organisation, eq(template.wsId, organisation.id))
		.innerJoin(member, eq(organisation.id, member.wsId))
		.where(eq(member.userId, userId))
		.orderBy(asc(template.createdAt)) // Ensures you get the "first" one
		.limit(1);

	return {
		success: true,
		template: result[0]?.template ?? null
	};
};

export const actions = {
	updateField: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) return { error: 'Unauthorized' };

		const formData = await request.formData();
		const templateId = formData.get('templateId') as string;
		const field = formData.get('field') as string;
		const value = formData.get('value') as string;

		await db
			.update(template)
			.set({ [field]: value })
			.where(eq(template.id, templateId));

		return { success: true };
	},
	updateLogoField: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) return { error: 'Unauthorized' };

		const formData = await request.formData();
		const templateId = formData.get('templateId') as string;
		const logoType = formData.get('logoType') as string;
		const file =
			logoType === 'survey'
				? (formData.get('logoFile') as File)
				: (formData.get('thankyouLogoFile') as File);

		console.log('file.name:', file.name);

		const temp = await db.query.template.findFirst({
			where: eq(template.id, templateId)
		});
		if (!temp) {
			fail(404, 'Template not found');
		}

		const oldUrl = logoType === 'survey' ? temp?.logoUrl : temp?.thankyouLogoUrl;

		// Validate file exists
		if (!file || file.size === 0) {
			return fail(400, { error: 'No file uploaded' });
		}

		// Validate file size (1MB limit)
		const MAX_SIZE = 1 * 1024 * 1024;
		if (file.size > MAX_SIZE) {
			return fail(400, { error: 'File too large. Maximum size is 1MB' });
		}

		// Validate file type
		if (!file.type.startsWith('image/')) {
			return fail(400, { error: 'File must be an image' });
		}

		try {
			// Convert File to Buffer
			const buffer = Buffer.from(await file.arrayBuffer());

			// 1. Resize and Compress using Sharp
			const optimizedBuffer = await sharp(buffer)
				.resize(150, 150, { fit: 'inside' }) // Max 200px
				.webp({ quality: 80 }) // High compression, low size
				.toBuffer();

			// 2. Read metadata from the *processed* image. The image
			//    dimensions will probably be helpful when used in emails.
			const metadata = await sharp(optimizedBuffer).metadata();
			const logoWidth = metadata.width;
			const logoHeight = metadata.height;

			// 3. Prepare for UploadThing
			// We convert the buffer back into a File object for the UTApi
			const fileName = changeFileExtension(file.name, 'webp');
			const fileToUpload = new File([new Uint8Array(optimizedBuffer)], fileName, {
				type: 'image/webp'
			});

			// 4. Upload to UploadThing
			const response = await utapi.uploadFiles(fileToUpload);

			if (response.error) {
				return fail(500, { error: 'Upload failed' });
			}

			const logoUrl = response.data.ufsUrl;

			// 5. Update Database
			if (logoType === 'survey') {
				await db
					.update(template)
					.set({ logoUrl, logoHeight, logoWidth }) // Make sure this matches your schema
					.where(eq(template.id, templateId));
			} else {
				await db
					.update(template)
					.set({
						thankyouLogoUrl: logoUrl,
						thankyouLogoHeight: logoHeight,
						thankyouLogoWidth: logoWidth
					}) // Make sure this matches your schema
					.where(eq(template.id, templateId));
			}

			// 6. Delete the old file from UploadThing
			if (oldUrl) {
				deleteFileFromUploadthing(oldUrl);
			}

			return { success: true, url: logoUrl };
		} catch (err) {
			console.error(err);
			return fail(500, { error: 'Internal server error during processing' });
		}
	},
	deleteLogoField: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) return { error: 'Unauthorized' };

		try {
			const formData = await request.formData();
			const templateId = formData.get('templateId') as string;
			const logoType = formData.get('logoType') as string;
			const temp = await db.query.template.findFirst({
				where: eq(template.id, templateId)
			});
			if (!temp) {
				fail(404, 'Template not found');
			}

			if (logoType === 'survey') {
				await db
					.update(template)
					.set({ logoUrl: null, logoHeight: null, logoWidth: null })
					.where(eq(template.id, templateId));
			} else {
				await db
					.update(template)
					.set({ thankyouLogoUrl: null, thankyouLogoHeight: null, thankyouLogoWidth: null })
					.where(eq(template.id, templateId));
			}
			// 6. Delete the old file from UploadThing
			if (temp?.logoUrl) {
				deleteFileFromUploadthing(temp.logoUrl);
			}

			return { success: true };
		} catch (err) {
			console.error(err);
			return fail(500, { error: 'Internal server error during processing' });
		}
	}
};
