'use server';

import { extractFilenameFromUrl } from '$lib/utils/filenames';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

export async function deleteFileFromUploadthing(fileUrl: string) {
	// debugger;
	try {
		const fileKey = extractFilenameFromUrl(fileUrl);
		if (!fileKey)
			return {
				success: false,
				error: 'Missing fileKey'
			};
		const res = await utapi.deleteFiles(fileKey);
		console.log('res:', res);
		return { success: true };
	} catch (error) {
		console.error('UTAPI: Error deleting file', error);
		return {
			success: false,
			error:
				typeof error === 'object' && error !== null && 'message' in error
					? (error as { message: string }).message
					: String(error)
		};
	}
}

export async function copyUploadThingFile(sourceUrl: string) {
	try {
		// Fetch the file from the source URL
		const response = await fetch(sourceUrl);

		if (!response.ok) {
			throw new Error(`Failed to fetch file: ${response.statusText}`);
		}

		// Get the file as a blob
		const blob = await response.blob();

		// Extract filename from URL or generate a new one
		const urlParts = sourceUrl.split('/');
		const originalFilename = urlParts[urlParts.length - 1];
		const timestamp = Date.now();
		const newFilename = `copy-${timestamp}-${originalFilename}`;

		// Create a File object from the blob
		const file = new File([blob], newFilename, { type: blob.type });

		// Upload the file to UploadThing
		const uploadResult = await utapi.uploadFiles(file);

		if (uploadResult.error) {
			throw new Error(`Upload failed: ${uploadResult.error.message}`);
		}

		return {
			success: true,
			url: uploadResult.data.url,
			key: uploadResult.data.key,
			name: uploadResult.data.name
		};
	} catch (error) {
		console.error('Error copying file:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

// Alternative: If you have the file key instead of URL
// export async function copyUploadThingFileByKey(fileKey: string) {
//   try {
//     // Get the file URL from the key
//     const fileUrl = `https://utfs.io/f/${fileKey}`;

//     // Use the main function
//     return await copyUploadThingFile(fileUrl);
//   } catch (error) {
//     console.error('Error copying file by key:', error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error occurred',
//     };
//   }
// }
