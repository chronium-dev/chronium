export function extractFilenameFromUrl(url: string): string | null | undefined {
	// Use a regular expression to match the filename in the URL
	const match = url.match(/\/([^\\/]+)$/);

	// If there's a match, return the captured filename; otherwise, return null
	return match ? match[1] : null;
}

/**
 * Changes the file extension of a filename
 * @param filename - The original filename (e.g., 'fred.jpg')
 * @param newExtension - The new extension without the dot (e.g., 'webp') or with dot (e.g., '.webp')
 * @returns The filename with the new extension
 */
export function changeFileExtension(filename: string, newExtension: string): string {
	// Remove leading dot from newExtension if present
	const cleanExtension = newExtension.startsWith('.') ? newExtension.slice(1) : newExtension;

	// Find the last dot in the filename
	const lastDotIndex = filename.lastIndexOf('.');

	// If there's no dot or the dot is at the start (hidden file), return filename with new extension
	if (lastDotIndex <= 0) {
		return `${filename}.${cleanExtension}`;
	}

	// Get the filename without extension
	const nameWithoutExtension = filename.substring(0, lastDotIndex);

	// Return with new extension
	return `${nameWithoutExtension}.${cleanExtension}`;
}

// Alternative version with additional options and validation
export function changeFileExtensionEnhanced(
	filename: string,
	newExtension: string,
	options: {
		keepDot?: boolean; // Whether to keep dot in newExtension parameter
		forceLowerCase?: boolean; // Whether to force lowercase extension
	} = {}
): string {
	const { keepDot = false, forceLowerCase = false } = options;

	// Ensure newExtension is clean
	let cleanExtension = newExtension;
	if (!keepDot) {
		cleanExtension = newExtension.startsWith('.') ? newExtension.slice(1) : newExtension;
	}

	// Apply lowercase if requested
	if (forceLowerCase) {
		cleanExtension = cleanExtension.toLowerCase();
	}

	// Handle edge cases
	if (!filename || filename.trim() === '') {
		throw new Error('Filename cannot be empty');
	}

	const lastDotIndex = filename.lastIndexOf('.');

	// Handle files without extension
	if (lastDotIndex === -1) {
		return `${filename}.${cleanExtension}`;
	}

	// Handle hidden files (starting with dot)
	if (lastDotIndex === 0) {
		return `${filename}.${cleanExtension}`;
	}

	const nameWithoutExtension = filename.substring(0, lastDotIndex);
	return `${nameWithoutExtension}.${cleanExtension}`;
}

// // Examples of usage:
// console.log(changeFileExtension('fred.jpg', 'webp')); // 'fred.webp'
// console.log(changeFileExtension('fred.jpg', '.webp')); // 'fred.webp'
// console.log(changeFileExtension('document', 'txt')); // 'document.txt'
// console.log(changeFileExtension('.hiddenfile', 'bak')); // '.hiddenfile.bak'
// console.log(changeFileExtension('archive.tar.gz', 'zip')); // 'archive.tar.zip'

// // Using the enhanced version
// console.log(changeFileExtensionEnhanced('fred.JPG', 'WEBP', { forceLowerCase: true })); // 'fred.webp'
// console.log(changeFileExtensionEnhanced('image.png', '.jpg', { keepDot: true })); // 'image.jpg'
