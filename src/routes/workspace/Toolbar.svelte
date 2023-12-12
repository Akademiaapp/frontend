<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isThemeChecked } from '../store';

	export let editor: Editor;

	export let checked = false;

	$: isThemeChecked.set(checked);
</script>

<div id="toolbar">
	<p>filename</p>
	<div id="style-controls">
		{#if editor}
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				class:active={editor.isActive('heading', { level: 1 })}
			>
				H1
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				class:active={editor.isActive('heading', { level: 2 })}
			>
				H2
			</button>
			<button
				on:click={() => editor.chain().focus().setParagraph().run()}
				class:active={editor.isActive('paragraph')}
			>
				P
			</button>
		{/if}
	</div>

	<div class="spacer"></div>

	<p>dark theme:</p>
	<input type="checkbox" bind:checked />
</div>

<style lang="scss">
	#toolbar {
		display: flex;
		gap: 1rem;
		padding: 1rem 2rem;

		align-items: center;
	}

	p {
		margin: 0;
	}

	#style-controls {
		display: flex;
		gap: 0.2rem;

		button {
			border: none;
			background-color: transparent;

			border-radius: 0.15rem;
			padding: 0.15rem 0.5rem;

			&.active {
				background-color: var(--color-overlay-1);
			}
		}
	}
</style>
