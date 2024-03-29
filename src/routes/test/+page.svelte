<script>
	// Add your script logic here
	function moveCursorToNextNodeStart(element) {
		if (element) {
			console.log('dhdh');
			const nextElement = element.nextElementSibling;
			if (nextElement) {
				const range = document.createRange();
				const selection = window.getSelection();

				range.setStart(nextElement.firstChild, 0);
				range.collapse(true);
				selection.removeAllRanges();
				selection.addRange(range);
				document.querySelector('#contedit').focus();
			}
		}
	}
</script>

<div contenteditable="true" class="p-4" id="contedit">
	<h1>hi</h1>
	<div contenteditable="false" id="hello">hello</div>
	<p>hello</p>
	<p>hello</p>
	<p>hello</p>
</div>

<button on:click={() => moveCursorToNextNodeStart(document.querySelector('#hello'))}
	>click me</button
>

<style>
	/* Add your component styles here */
</style>
