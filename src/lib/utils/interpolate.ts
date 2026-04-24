// utils/interpolate.ts

/**
 * Replaces {{key}} tokens in a string with values from an object
 */
export function interpolate(template: string, data: Record<string, string | number>): string {
	return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
		const value = data[key.trim()];
		return value !== undefined ? String(value) : match;
	});
}
