export function printUsingWindow(content: string) {
	const printWindow = window.open('/print', undefined, 'popup');
	console.log('dhdhdh');
	if (!printWindow) return;
	printWindow?.addEventListener('DOMContentLoaded', () => {
		console.log('loaded');
		console.log(printWindow.document);
		printWindow.document.getElementsByTagName('BODY')[0].innerHTML = content;
		setTimeout(() => {
			printWindow.print();

			setTimeout(() => {
				printWindow.close();
			}, 200);
		}, 200);
	});
}
