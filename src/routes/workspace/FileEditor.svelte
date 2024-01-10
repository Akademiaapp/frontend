<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import Tiptap from './Tiptap.svelte';
	import Toolbar from './Toolbar.svelte';
	import Overview from './Overview.svelte';

	export let editor: Editor;

	export let activeFile: string;
</script>

<div class="editor_wrapper">
	<div class="pages">
		<div class="page">
			<Tiptap {activeFile} bind:editor />
		</div>
		<div class="page"></div>
		{#if editor}
			<Overview tiptap={editor} {activeFile}></Overview>
		{/if}
	</div>
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
		padding-top: 4.5rem;
		position: absolute;

		// transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		gap: 5rem;
	}

	.editor_wrapper {
		display: flex;
		justify-content: center;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;

		position: absolute;

		z-index: 0;

		// flex: 1;
		// overflow-y: scroll;
		&:hover,
		:active,
		:focus {
			// overflow-y: auto;
			&::-webkit-scrollbar {
				opacity: 1;
			}
		}
		&::-webkit-scrollbar {
			width: 10px;
			opacity: 0;
			background-color: white;
		}

		&::webkit-scrollbar-button {
			display: none;
		}

		/* Track */
		&::-webkit-scrollbar-track {
			/* background-color: var(--color-bg-2); */
			background-color: transparent;
		}

		/* Handle */
		&::-webkit-scrollbar-thumb {
			border-radius: 100px;
			background-color: var(--color-text-3);
		}

		/* Handle on hover */
		&::-webkit-scrollbar-thumb:hover {
			background: var(--color-text-2);
		}
	}
</style>
