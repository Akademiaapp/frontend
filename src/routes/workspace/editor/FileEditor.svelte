<script lang="ts">
	import Tiptap from './tiptap/Tiptap.svelte';
	import Overview from './Overview.svelte';
	import { editor } from './editorStore';

	var scale = 1;

	function onScroll(e: WheelEvent) {
		if (!e.ctrlKey) return;
		e.preventDefault();
		scale *= 1 + Math.sign(-e.deltaY) * 0.1;
		const maxScale = (window.innerWidth - 250) / 950;
		scale = Math.min(scale, maxScale);
	}

	let connected;
</script>

<!-- content here -->
<div class="editor_wrapper" style:display={connected ? null : 'none'} on:wheel={onScroll}>
	<div id="pages" style:scale>
		<div class="page">
			<Tiptap bind:connected />
		</div>
		<div class="page"></div>
	</div>
	<Overview></Overview>
</div>

<style lang="scss">
	.page {
		// aspect-ratio: 1.414;
		width: 750px;
		height: 1000px;

		background-color: var(--color-bg-1);

		padding: 2rem 4rem;
	}

	#pages {
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
