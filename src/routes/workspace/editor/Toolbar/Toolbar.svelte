<script lang="ts">
	import Asign from './Asign.svelte';

	import ShareDocument from './ShareDocument.svelte';
	import { Bold, Brush, Italic } from 'lucide-svelte';
	import MoreActions from './MoreActions.svelte';
	import { editor } from '../editorStore';
	import { Assignment, currentFile } from '@/api/apiStore';
	import * as Select from "$lib/components/ui/select/index.js";
	import ToolbarButton from './ToolbarButton.svelte';

	let selection = $editor;

	let selectedType = 'p';

	$: $editor?.on('selectionUpdate', () => {
		selection = $editor;
		selectedType = $editor.getAttributes('heading').level ? 'h' + $editor.getAttributes('heading').level : 'p';
	});
	$: $editor?.on('update', () => (selection = $editor));

	function nodeOrSelected() {
		// let focus = $editor.commands.focus();
		const selection = $editor.state.selection;
		if (selection.from == selection.to) {
			return $editor.chain().selectParentNode();
		} else {
			return $editor.chain().focus();
		}
	}

	const text_types = [
		{
			label: 'Heading 1',
			type: 'heading',
			value: 'h1',
			level: 1
		},
		{
			label: 'Heading 2',
			type: 'heading',
			value: 'h2',
			level: 2
		},
		{
			label: 'Heading 3',
			type: 'heading',
			value: 'h3',
			level: 3
		},
		{
			label: 'Paragraph',
			type: 'paragraph',
			value: 'p'
		},
	];

	function handleTextTypeSelection(event) {
		if (event.type == 'heading') {
			$editor.chain().focus().setHeading({ level: event.level }).run();
		} else {
			$editor.chain().focus().setParagraph().run();
		}
	}

	let selectedTypeObject = text_types.find((type) => type.value == selectedType);
	$: selectedType, selectedTypeObject = text_types.find((type) => type.value == selectedType);

</script>

{#if $editor}
	<div id="toolbar">
		<!-- <div id="filepath">
			<div class="color"></div>
			<p class="filename">{activeFile}</p>
		</div> -->
		<!-- <div class="splitter"></div> -->
		<div id="style-controls" class="br-2 bar frontground">
			<Select.Root portal={null} selected={{ value: selectedType, label: selectedTypeObject.label }} >
				<Select.Trigger class="w-32 h-8">
					<Select.Value />
				</Select.Trigger>
				<Select.Content>
					{#each text_types as type}
						<Select.Item
							value={type.value}
							label={type.label}
							on:click={() => handleTextTypeSelection(type)}
						>
							{type.label}
						</Select.Item>
					{/each}
				</Select.Content>
				<Select.Input name="selectedTextType" />
			</Select.Root>
			<div>
				<input
					type="color"
					on:input={(event) => $editor.chain().focus().setColor(event.target?.value).run()}
					value={$editor.getAttributes('textStyle').color}
					id="text-color"
					class="absolute invisible"
				/>
				<label class="text-color" for="text-color" style={'color: ' + $editor.getAttributes('textStyle').color}
					><Brush size="18" color={selection.getAttributes('textStyle').color} /></label
				>
			</div>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleBold().run()}
				title="Fed skrift"
				selected={selection.isActive('bold')}
			>
				<Bold size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleItalic().run()}
				title="Korsiv"
				selected={selection.isActive('italic')}
			>
				<Italic size="18" />
			</ToolbarButton>
		</div>
		<div class="absolute right-0 flex h-full gap-2">
			{#if $currentFile instanceof Assignment}
				<Asign />
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
		height: 5rem;
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

    .toolbar-button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.35rem;
        border-radius: 0.2rem;
        transition: background-color 0.2s;
        color: var(--text-color);
    }

    .toolbar-button:hover {
        background-color: var(--color-overlay-0);
    }

    .toolbar-button.active {
        background-color: var(--color-overlay-1);
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
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem !important;
		transition: background-color 0.2s;
		height: inherit;
	}
</style>
