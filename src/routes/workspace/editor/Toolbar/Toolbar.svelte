<script lang="ts">
	import Assign from './Assign.svelte';

	import ShareDocument from './ShareDocument.svelte';
	import { Bold, Brush, Code, CodeSquare, Italic, Link, Strikethrough, Subscript, Superscript, Underline } from 'lucide-svelte';
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

	function setLink () {
		const previousUrl = $editor.getAttributes('link').href
		const url = window.prompt('URL', previousUrl)

		// cancelled
		if (url === null) {
			return
		}

		// empty
		if (url === '') {
			$editor
			.chain()
			.focus()
			.extendMarkRange('link')
			.unsetLink()
			.run()

			return
		}

		// update link
		$editor
			.chain()
			.focus()
			.extendMarkRange('link')
			.setLink({ href: url })
			.run()
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

{#if $editor && selection}
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
				<label class="text-color" for="text-color" style={'color: ' + selection.getAttributes('textStyle').color}
					><Brush size="18" /></label
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
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleUnderline().run()}
				title="Understreget"
				selected={selection.isActive('underline')}
			>
				<Underline size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleStrike().run()}
				title="Gennemstreget"
				selected={selection.isActive('strike')}
			>
				<Strikethrough size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleSuperscript().run()}
				title="Eksponent"
				selected={selection.isActive('superscript')}
			>
				<Superscript size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleSubscript().run()}
				title="Indeks"
				selected={selection.isActive('subscript')}
			>
				<Subscript size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={setLink}
				title="Link"
				selected={selection.isActive('link')}
			>
				<Link size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleCode().run()}
				title="Kode"
				selected={selection.isActive('code')}
			>
				<Code size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleCodeBlock().run()}
				title="Kodeblok"
				selected={selection.isActive('codeBlock')}	
			>
				<CodeSquare size="18" />
			</ToolbarButton>
			<!-- <ToolbarButton
				onClick={(event) => }
				title="Sorteret liste"
				selected={}
			>
				<SortNumericAsc size="18" />
			</ToolbarButton> -->
		</div>
		<div class="absolute right-0 flex h-full gap-2">
			{#if $currentFile instanceof Assignment}
				<Assign />
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

	.bar {
		display: flex;
		gap: 0.4rem;
		padding: 0.2rem 1rem;

		// height: 3rem;

		align-items: center;

		box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.05);

		border-bottom: solid var(--color-overlay-1) 0.05rem;
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
