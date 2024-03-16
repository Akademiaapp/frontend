<script lang="ts">
	import { createPicker } from 'picmo';
	import { TwemojiRenderer } from '@picmo/renderer-twemoji';
	import { onMount } from 'svelte';

	onMount(() => {
		// The picker must have a root element to insert itself into
		const rootElement: HTMLElement = document.querySelector('#pickerContainer');

		// Create the picker
		const picker = createPicker({
			rootElement,
			renderer: new TwemojiRenderer()
		});

		// The picker emits an event when an emoji is selected. Do with it as you will!
		picker.addEventListener('emoji:select', (event) => {
			console.log('Emoji selected:', event.emoji);
		});
	});
</script>

<main>
	<h1>Better Emoji Page</h1>
	<p>Selected Emoji:</p>

	<div id="pickerContainer"></div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		font-family: Arial, sans-serif;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	p {
		font-size: 1.5rem;
	}
</style>
