export function printUsingWindow(content: string) {
	const printWindow = window.open('/print', undefined, 'popup');
	if (!printWindow) return;
	printWindow?.addEventListener('DOMContentLoaded', () => {
		console.log('loaded');
		console.log(printWindow.document);
		printWindow.document.getElementsByTagName('BODY')[0].innerHTML = content;
		setTimeout(() => {
			printWindow.print();

			window.addEventListener('afterprint', () => printWindow.close);
		}, 1000);
	});
}
