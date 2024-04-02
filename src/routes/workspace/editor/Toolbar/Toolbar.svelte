<script lang="ts">
	import { AssignmentAnswer, DocumentInfo } from './../../../../lib/api/apiStore';
	import SeeAnswers from './SeeAnswers.svelte';
	import Assign from './Assign.svelte';

	import ShareDocument from './ShareDocument.svelte';
	import {
		Image,
		AlignCenter,
		AlignJustify,
		AlignLeft,
		AlignRight,
		Bold,
		Brush,
		Calculator,
		Code,
		CodeSquare,
		Highlighter,
		Italic,
		Link,
		List,
		ListOrdered,
		ListTodo,
		MessageSquareQuote,
		Minus,
		Strikethrough,
		Subscript,
		Superscript,
		Underline,
		Redo2,
		Undo2,
		BetweenHorizonalEnd
	} from 'lucide-svelte';
	import MoreActions from './MoreActions.svelte';
	import { editor } from '../editorStore';
	import { Assignment, currentFile } from '@/api/apiStore';
	import * as Select from '$lib/components/ui/select/index.js';
	import ToolbarButton from './ToolbarButton.svelte';
	import Aflever from './Aflever.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import FontSelector from './FontSelector.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '@/components/ui/button';

	let selection = $editor;

	let selectedTextStyle = {
		color: 'black',
		fontSize: '12em',
		fontFamily: 'NimbusSans-Regular'
	};
	let selectedType = 'p';

	$: $editor?.on('selectionUpdate', () => {
		selection = $editor;
		selectedType = $editor.getAttributes('heading').level
			? 'h' + $editor.getAttributes('heading').level
			: 'p';
		selectedTextStyle = selection.getAttributes('textStyle') as {
			color: string;
			fontSize: string;
			fontFamily: string;
		};
	});
	$: $editor?.on('update', () => (selection = $editor));

	export let isNote = false;

	function nodeOrSelected() {
		// let focus = $editor.commands.focus();
		const selection = $editor.state.selection;
		if (selection.from == selection.to) {
			return $editor.chain().selectParentNode();
		} else {
			return $editor.chain().focus();
		}
	}

	function setLink() {
		const previousUrl = $editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			$editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		// update link
		$editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	function setImage() {
		const previousUrl = $editor.getAttributes('image').src;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			$editor.chain().focus().setImage({ src: null }).run();

			return;
		}

		// update link
		$editor.chain().focus().setImage({ src: url }).run();
	}

	const text_types = [
		{
			label: 'Overskrift 1',
			type: 'heading',
			value: 'h1',
			level: 1
		},
		{
			label: 'Overskrift 2',
			type: 'heading',
			value: 'h2',
			level: 2
		},
		{
			label: 'Overskrift 3',
			type: 'heading',
			value: 'h3',
			level: 3
		},
		{
			label: 'Normal tekst',
			type: 'paragraph',
			value: 'p'
		}
	];

	function handleTextTypeSelection(event) {
		if (event.type == 'heading') {
			$editor.chain().focus().setHeading({ level: event.level }).run();
		} else {
			$editor.chain().focus().setParagraph().run();
		}
	}

	let selectedTypeObject = text_types.find((type) => type.value == selectedType);
	$: selectedType, (selectedTypeObject = text_types.find((type) => type.value == selectedType));

	let isShareOpen = false;
</script>

{#if $editor && selection && selectedTextStyle && selectedTypeObject}
	<div id="toolbar">
		<div class="flex-[100px]"></div>
		<div id="style-controls" class="br-2 bar frontground">
			<ToolbarButton
				onClick={(event) => $editor.chain().focus().undo().run()}
				title="Fortryd"
				selected={false}
			>
				<Undo2 size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={(event) => $editor.chain().focus().redo().run()}
				title="Gentag"
				selected={false}
			>
				<Redo2 size="18" />
			</ToolbarButton>
			<div class="mx-1 h-8 border-r-[0.5px] border-gray-400 opacity-50" />
			<div class="flex">
				<FontSelector />
				<Input
					type="number"
					class="h-8 w-[3.2rem] rounded-l-none border-l-0 pl-2 pr-[2.5px]"
					placeholder="16"
					value={selectedTextStyle.fontSize ? selectedTextStyle?.fontSize.replace(/\D/g, '') : '12'}
					on:change={(event) =>
						$editor
							.chain()
							.focus()
							.setFontSize(event.target?.value + 'pt')
							.run()}
				/>
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
				onClick={(event) => $editor.chain().focus().toggleHighlight().run()}
				title="Highlight"
				selected={selection.isActive('highlight')}
			>
				<Highlighter size="18" />
			</ToolbarButton>
			<Popover.Root portal={null}>
				<Popover.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" class="h-8 p-[0.35rem]"
						><AlignLeft size="18" /></Button
					>
				</Popover.Trigger>
				<Popover.Content class="h-12 w-fit p-2">
					<div class="flex gap-1">
						<ToolbarButton
							onClick={(event) => $editor.chain().focus().setTextAlign('left').run()}
							title="Venstrejusteret"
							selected={selection.isActive({ textAlign: 'left' })}
						>
							<AlignLeft size="18" />
						</ToolbarButton>
						<ToolbarButton
							onClick={(event) => $editor.chain().focus().setTextAlign('center').run()}
							title="Centreret"
							selected={selection.isActive({ textAlign: 'center' })}
						>
							<AlignCenter size="18" />
						</ToolbarButton>
						<ToolbarButton
							onClick={(event) => $editor.chain().focus().setTextAlign('right').run()}
							title="Højrejusteret"
							selected={selection.isActive({ textAlign: 'right' })}
						>
							<AlignRight size="18" />
						</ToolbarButton>
						<ToolbarButton
							onClick={(event) => $editor.chain().focus().setTextAlign('justify').run()}
							title="Lige margener"
							selected={selection.isActive({ textAlign: 'justify' })}
						>
							<AlignJustify size="18" />
						</ToolbarButton>
					</div>
				</Popover.Content>
			</Popover.Root>
			<div class="h-[2rem] border-l-[0.8px] border-gray-400 opacity-50" />
			<div>
				<input
					type="color"
					on:input={(event) => $editor.chain().focus().setColor(event.target?.value).run()}
					value={selectedTextStyle.color}
					id="text-color"
					class="invisible absolute"
				/>
				<label
					class="text-color"
					for="text-color"
					style={'color: ' + selection.getAttributes('textStyle').color}><Brush size="18" /></label
				>
			</div>
			<Select.Root
				portal={null}
				selected={{ value: selectedType, label: selectedTypeObject.label }}
			>
				<Select.Trigger class="h-8 w-[7.8rem]">
					<Select.Value />
				</Select.Trigger>
				<Select.Content class="!w-36">
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
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleSuperscript().run()}
				title="Eksponent"
				selected={selection.isActive('superscript')}
				class="hidden 2xl:flex"
			>
				<Superscript size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleSubscript().run()}
				title="Indeks"
				selected={selection.isActive('subscript')}
				class="hidden 2xl:flex"
			>
				<Subscript size="18" />
			</ToolbarButton>
			<Popover.Root portal={null}>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="ghost"
						class="visible h-8 p-[0.35rem] 2xl:hidden"
						title="List"><Superscript size="18" /></Button
					>
				</Popover.Trigger>
				<Popover.Content class="h-12 w-fit p-2">
					<div class="flex gap-1">
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
					</div>
				</Popover.Content>
			</Popover.Root>
			<ToolbarButton onClick={setLink} title="Link" selected={selection.isActive('link')}>
				<Link size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleCode().run()}
				title="Kode"
				selected={selection.isActive('code')}
				class="hidden 2xl:flex"
			>
				<Code size="18" />
			</ToolbarButton>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleCodeBlock().run()}
				title="Kodeblok"
				selected={selection.isActive('codeBlock')}
				class="hidden 2xl:flex"
			>
				<CodeSquare size="18" />
			</ToolbarButton>
			<Popover.Root portal={null}>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="ghost"
						class="visible h-8 p-[0.35rem] 2xl:hidden"
						title="kode"><Code size="18" /></Button
					>
				</Popover.Trigger>
				<Popover.Content class="h-12 w-fit p-2">
					<div class="flex gap-1">
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
					</div>
				</Popover.Content>
			</Popover.Root>
			<ToolbarButton
				onClick={(event) => nodeOrSelected().toggleBlockquote().run()}
				title="Citat"
				selected={selection.isActive('blockquote')}
			>
				<MessageSquareQuote size="18" />
			</ToolbarButton>
			<Popover.Root portal={null}>
				<Popover.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" class="h-8 p-[0.35rem]" title="Liste"
						><List size="18" /></Button
					>
				</Popover.Trigger>
				<Popover.Content class="h-12 w-fit p-2">
					<div class="flex gap-1">
						<ToolbarButton
							onClick={(event) => nodeOrSelected().toggleOrderedList().run()}
							title="Sorteret liste"
							selected={selection.isActive('orderedList')}
						>
							<ListOrdered size="18" />
						</ToolbarButton>
						<ToolbarButton
							onClick={(event) => nodeOrSelected().toggleBulletList().run()}
							title="Punktopstilling"
							selected={selection.isActive('bulletList')}
						>
							<List size="18" />
						</ToolbarButton>
						<ToolbarButton
							onClick={(event) => nodeOrSelected().toggleTaskList().run()}
							title="Todo liste"
							selected={selection.isActive('taskList')}
						>
							<ListTodo size="18" />
						</ToolbarButton>
					</div>
				</Popover.Content>
			</Popover.Root>
			<Popover.Root portal={null}>
				<Popover.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" class="h-8 p-[0.35rem]" title="Insert"
						><BetweenHorizonalEnd size="18" /></Button
					>
				</Popover.Trigger>
				<Popover.Content class="h-12 w-fit p-2">
					<div class="flex gap-1">
						<ToolbarButton
							onClick={(event) => $editor.chain().focus().setHorizontalRule().run()}
							title="Horizontal linje"
							selected={false}
						>
							<Minus size="18" />
						</ToolbarButton>
						<ToolbarButton
							onClick={(event) => $editor.chain().focus().setMath().run()}
							title="Matematik felt"
							selected={selection.isActive('math')}
						>
							<Calculator size="18" />
						</ToolbarButton>
						<ToolbarButton onClick={setImage} title="Billede" selected={false}>
							<Image size="18" />
						</ToolbarButton>
					</div>
				</Popover.Content>
			</Popover.Root>
		</div>
		<div class="flex h-full flex-[100px] justify-end gap-2 pl-4">
			{#if $currentFile instanceof Assignment}
				<Assign />
			{:else if $currentFile instanceof AssignmentAnswer}
				<Aflever />
			{/if}
			<ShareDocument bind:open={isShareOpen} showTrigger={$currentFile instanceof DocumentInfo} />
			<MoreActions bind:isShareOpen bind:isNote></MoreActions>
		</div>
	</div>
{/if}

<style lang="scss">
	#toolbar {
		z-index: 1;
		position: sticky;
		top: var(--pad);
		pointer-events: auto;
		height: 2.65em;
		display: flex;
		left: 2rem;

		align-self: stretch;

		// align-items: center;
		justify-content: space-between;
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
		border-radius: 0.2rem;
	}

	.text-color:hover {
		background-color: var(--color-overlay-0);
	}
</style>
