<script lang="ts">
	import SeeAnswers from './SeeAnswers.svelte';
	import Assign from './Assign.svelte';
	import { themeVariant } from '../../../store';

	import ShareDocument from './ShareDocument.svelte';
	import { Brush } from 'lucide-svelte';
	import MoreActions from './MoreActions.svelte';
	import { editor } from '../editorStore';
	import { Assignment, currentFile } from '@/api/apiStore';

	let selection = $editor;

	export let checked = $themeVariant == 'dark';

	$: $editor?.on('selectionUpdate', () => {
		selection = $editor;
	});
	$: $editor?.on('update', () => (selection = $editor));

	$: themeVariant.set(checked ? 'dark' : 'light');

	let textcolor: string;

	let isAssigned = $currentFile instanceof Assignment && $currentFile.isPublic;

	function nodeOrSelected() {
		// let focus = $editor.commands.focus();
		const selection = $editor.state.selection;
		if (selection.from == selection.to) {
			return $editor.chain().selectParentNode();
		} else {
			return $editor.chain().focus();
		}
	}
</script>

{#if $editor}
	<div id="toolbar">
		<!-- <div id="filepath">
			<div class="color"></div>
			<p class="filename">{activeFile}</p>
		</div> -->
		<!-- <div class="splitter"></div> -->
		<div id="style-controls" class="br-2 bar frontground">
			<button
				on:click={() => $editor.chain().focus().toggleHeading({ level: 1 }).run()}
				class:active={selection?.isActive('heading', { level: 1 })}
			>
				H1
			</button>
			<button
				on:click={() => $editor.chain().focus().toggleHeading({ level: 2 }).run()}
				class:active={selection?.isActive('heading', { level: 2 })}
			>
				H2
			</button>
			<button
				on:click={() => $editor.chain().focus().setParagraph().run()}
				class:active={selection?.isActive('paragraph')}
			>
				P
			</button>
			<div class="smal-splitter"></div>
			<div class="text-color h-full">
				<input
					type="color"
					on:input={(event) => $editor.chain().focus().setColor(event.target?.value).run()}
					value={$editor.getAttributes('textStyle').color}
					id="text-color"
				/>
				<label for="text-color" style={'color: ' + $editor.getAttributes('textStyle').color}
					><Brush size="15"></Brush></label
				>
			</div>
			<button on:click={(event) => nodeOrSelected().toggleBold().run()} class="flex items-center"
				><span class="material-symbols-rounded"> format_bold </span></button
			>
			<div class="spacer"></div>

			<div class="darkmode_toggle">
				<input type="checkbox" id="mode_toggle" bind:checked />
				<label for="mode_toggle"></label>
			</div>
		</div>
		<div class="absolute right-0 flex h-full gap-2">
			{#if $currentFile instanceof Assignment}
				{#if isAssigned}
					<SeeAnswers />
				{:else}
					<Assign bind:isAssigned />
				{/if}
			{:else}
				<ShareDocument />
			{/if}
			<MoreActions></MoreActions>
		</div>
	</div>
{/if}

<style lang="scss">
	#toolbar {
		z-index: 1;
		position: sticky;
		top: var(--pad);
		pointer-events: auto;
		width: 100%;
		display: flex;

		// align-items: center;
		justify-content: center;
	}

	.material-symbols-rounded {
		height: 1rem;
		line-height: 1rem;
		// width: 1rem;
		margin: 0 -0.3rem;
		// font-size: 1.3em;

		// line-height: 1;
		// text-size-adjust: 100%;
	}

	button {
		span {
			// text-align: center;
			// vertical-align: middle;
			font-weight: 600;
			text-size-adjust: 100%;
			line-height: 1.5;
			box-sizing: border-box;
			overflow: hidden;
		}
	}

	.bar {
		display: flex;
		gap: 0.4rem;
		padding: 0.2rem 1rem;

		// height: 3rem;

		align-items: center;

		box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.05);

		border-bottom: solid var(--color-overlay-1) 0.05rem;
	}

	.left {
		position: absolute;
		right: 0;
		height: -webkit-fill-available;
		// height: 100%;
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
		min-width: 400px;
		display: flex;
		gap: 0.2rem;
		align-items: center;

		button,
		label {
			border: none;
			background-color: transparent;

			border-radius: 0.2rem;
			padding: 0.15rem 0.5rem;
			height: 100%;

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
			p {
				color: var(--color-text-1);
			}
			// font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
