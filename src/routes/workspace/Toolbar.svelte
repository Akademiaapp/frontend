<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { isThemeChecked } from '../store';
	import ApiHandler from '../../lib/api';

	import { getContext } from 'svelte';
	import type { AuthorizerState } from '@authorizerdev/authorizer-svelte/types';
	import type { Readable } from 'svelte/store';

	const api = new ApiHandler(<Readable<AuthorizerState>>getContext('authorizerContext'));

	export let editor: Editor;

	export let checked = false;

	export let activeFile: string;

	$: isThemeChecked.set(checked);

	let textcolor: string;
</script>

{#if editor}
	<div id="toolbar" class="br-2">
		<!-- <div id="filepath">
			<div class="color"></div>
			<p class="filename">{activeFile}</p>
		</div> -->
		<!-- <div class="splitter"></div> -->
		<div id="style-controls">
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
				<div class="smal-splitter"></div>
				<div class="text-color">
					<input
						type="color"
						on:input={(event) => editor.chain().focus().setColor(event.target?.value).run()}
						value={editor.getAttributes('textStyle').color}
						id="text-color"
					/>
					<label for="text-color" style={'color: ' + editor.getAttributes('textStyle').color}>A</label
					>
				</div>
		</div>

		<div class="spacer"></div>

		<div class="darkmode_toggle">
			<input type="checkbox" id="mode_toggle" bind:checked />
			<label for="mode_toggle"></label>
		</div>
	</div>
{/if}

<style lang="scss">
	#toolbar {
		position: sticky;
		top: var(--pad);
		pointer-events: auto;
		z-index: 1;
		width: 400px;

		display: flex;
		gap: 1rem;
		padding: 0.3rem 1rem;

		background-color: var(--color-bg-1);

		box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.05);

		align-items: center;
		justify-items: center;

		border-bottom: solid var(--color-overlay-1) 0.05rem;
	}

	.darkmode_toggle label {
		filter: invert(var(--invert-1));
		color: var(--color-text-2);
		cursor: pointer;
		display: inline-block;
		position: relative;
		transition: all ease-in-out 0.5s;
		width: 25px;
		height: 25px;
	}

	.darkmode_toggle {
		height: 25px;

		input[type='checkbox'] {
			display: none;
		}

		input[type='checkbox'] {
			~ label {
				background-image: url('/icons/light_mode.svg');
				background-size: 15px;

				background-repeat: no-repeat;
				background-position: center;
			}

			&:checked ~ label {
				background-image: url('/icons/dark_mode.svg');
			}
		}
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

	.smal-splitter {
		width: 0.1rem;
		background-color: var(--color-overlay-1);
		margin: 0rem 0.5rem;
		height: 1.5rem;
	}

	p {
		margin: 0;
	}

	#style-controls {
		display: flex;
		gap: 0.2rem;
		align-items: center;

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

	.text-color {
		input {
			visibility: hidden;
			position: absolute;
		}
		label {
			font-weight: bold;
		}
	}
</style>
