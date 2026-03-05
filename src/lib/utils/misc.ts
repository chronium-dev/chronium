export function getAbbreviation(input: string): string {
	// Regular expression to match email addresses
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// If the input is an email address, extract the name part
	const processedInput = emailRegex.test(input) ? input.split('@')[0] : input;

	if (!processedInput) return '??';

	// Split the processed input into words
	const words = processedInput.split(/[\s.]+/);

	//if (!words || !words[0]) return '??';

	if (words.length === 1) {
		// If there's only one word, take the first two letters
		return words[0] ? words[0].substring(0, 2).toUpperCase() : '??';
	} else {
		// If there are multiple words, take the first letter of the first two words
		const w1 = words[0] && words[0][0] ? words[0][0] : '?';
		const w2 = words[1] && words[1][0] ? words[1][0] : '?';
		return (w1 + w2).toUpperCase();
	}
}
