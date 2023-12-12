<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isThemeChecked } from '../store';

	export let editor: Editor;

	export let checked = false;

	export let activeFile;

	$: isThemeChecked.set(checked);
</script>

<div id="toolbar">
	<div id="filepath">
		<div class="color"></div>
		<p class="filename">{activeFile}</p>
	</div>
	<div class="splitter"></div>
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
		padding: 0.75rem 1rem;

		align-items: center;

		border-bottom: solid var(--color-overlay-1) 0.05rem;
	}

	.color {
		height: 0.7rem;
		width: 0.7rem;
		border-radius: 100%;
		background-color: #278aff;
	}

	#filepath {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.filename {
		color: var(--color-text-2);
	}

	.splitter {
		width: 0.1rem;
		background-color: var(--color-overlay-1);
		height: 100%;
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

			border-radius: 0.2rem;
			padding: 0.15rem 0.5rem;

			// transition: background-color 100ms;
			&:hover {
				background-color: var(--color-overlay-0);
			}
			&.active {
				background-color: var(--color-overlay-1);
			}
		}
	}
</style>
