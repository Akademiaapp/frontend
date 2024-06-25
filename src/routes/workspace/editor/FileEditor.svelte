<script lang="ts">
	import Tiptap from './tiptap/Tiptap.svelte';
	import Overview from './Overview.svelte';
	export let is_note = false;

	var scale = 1;

	function onScroll(e: WheelEvent) {
		if (is_note) return;
		if (!e.ctrlKey) return;
		e.preventDefault();
		scale *= 1 + Math.sign(-e.deltaY) * 0.1;
		const maxScale = (window.innerWidth - 250) / 950;
		scale = Math.min(scale, maxScale);
	}

	let connected;
</script>

<!-- content here -->
<div
	class="editor_wrapper"
	style:display={connected ? null : 'none'}
	style:width={is_note ? '100%' : 'max-content'}
	on:wheel={onScroll}
>
	<div id="pages" style:scale style:width={is_note ? '100%' : 'max-content'}>
		<div class={'page' + (is_note ? ' w-full' : ' w-[750px]')}>
			<Tiptap bind:connected />
		</div>
		<div class="page" hidden={is_note} />
		<div class="page" hidden={is_note} />
		<div class="page" hidden={is_note} />
		<div class="page" hidden={is_note} />
	</div>
	{#if !is_note}
		<Overview />
	{/if}
</div>

<style lang="scss">
	.page {
		// aspect-ratio: 1.414;
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
	}

	.editor_wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 100%;
		margin-right: 1rem;
		margin-left: var(--gap);
	}
</style>
