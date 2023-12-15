<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isThemeChecked } from '../store';

	export let editor: Editor;

	export let checked = false;

	export let activeFile: string;

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
		<div class="splitter"></div>
	</div>

	<div class="spacer"></div>

	<div class="darkmode_toggle">
		<input type="checkbox" id="mode_toggle" bind:checked />
		<label for="mode_toggle"></label>
	</div>

	<div class="splitter"></div>
</div>

<style lang="scss">
	.darkmode_toggle input[type=checkbox] {
		display: none;
	}

	.darkmode_toggle label {
		border: 2px solid #555;
		color: var(--color-text-2);
		border-radius: 50px;
		cursor: pointer;
		display: inline-block;
		position: relative;
		transition: all ease-in-out 0.5s;
		width: 25px;
		height: 25px;
	}

	.darkmode_toggle input[type=checkbox] ~ label {
		background-image: url("/icons/light_mode.svg");
		background-size: 15px;
		background-color: var(--color-text-2);
		background-repeat: no-repeat;
		background-position: center;
	}

	.darkmode_toggle input[type=checkbox]:checked ~ label {
		background-image: url("/icons/dark_mode.svg");
	}

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
		width: 0.06rem;
		background-color: var(--color-overlay-1);
		height: 100%;
	}

	p {
		margin: 0;
	}

	#style-controls {
		display: flex;
		gap: 0.2rem;
		align-items: stretch;

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
