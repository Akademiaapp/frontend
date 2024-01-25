<script lang="ts">
	import { minMax, type Editor } from '@tiptap/core';
	import Tiptap from './Tiptap.svelte';
	import Overview from './Overview.svelte';
	export let editor: Editor;

	export let activeFile: string;
	export let activeFilename: string;

	var scale = 1;

	function onScroll(e: Event) {
		if (!e.ctrlKey) return;
		e.preventDefault();
		scale *= 1 + Math.sign(e.wheelDeltaY) * 0.1;
		const maxScale = (window.innerWidth - 250) / 950;
		scale = Math.min(scale, maxScale);
	}
	// addEventListener('resize', (event) => {
	// 	console.log(window.innerWidth);

	// 	scale = (window.innerWidth - 250) / 800;
	// });
</script>

<div class="editor_wrapper" style:display={editor ? null : 'none'} on:mousewheel={onScroll}>
	<div class="pages" style:scale>
		<div class="page">
			<Tiptap {activeFile} {activeFilename} bind:editor />
		</div>
		<div class="page"></div>
	</div>
	<Overview tiptap={editor}></Overview>
</div>

<style lang="scss">
	.page {
		// aspect-ratio: 1.414;
		width: 750px;
		height: 1000px;

		background-color: var(--color-bg-1);

		padding: 2rem 4rem;
	}

	.pages {
		// transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		gap: 5rem;
		transform-origin: top;
		max-width: 100%;
	}

	.editor_wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: fit-content;
		max-width: 100%;
		margin-right: 1rem;
		margin-left: var(--gap);
	}
</style>
