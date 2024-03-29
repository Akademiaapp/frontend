export function capLength(inputString: string, maxLength: number): string {
	if (inputString.length <= maxLength) return inputString;

	let truncatedString = inputString.substring(0, maxLength - 3).trim();
	// Remove trailing hyphens
	while (truncatedString.endsWith('-') || truncatedString.endsWith('.')) {
		truncatedString = truncatedString.slice(0, -1).trim();
	}
	return truncatedString + '...';
}
