<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';
	import { editor } from '../editorStore';

	let open = false;
	let value = '';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

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

	const text_fonts = [
		{
			label: 'Inter',
			value: 'Inter'
		},
		{
			label: 'Comic Sans',
			value: 'Comic Sans'
		},
		{
			label: 'Serif',
			value: 'serif'
		},
		{
			label: 'Monospace',
			value: 'monospace'
		},
		{
			label: 'Cursive',
			value: 'cursive'
		}
	];

	function handleTextFontSelection(event) {
		$editor.chain().focus().setFontFamily(event.value).run();
	}

	let selectedFontObject =
		text_fonts.find((font) => font.value == selectedTextStyle.fontFamily) || text_fonts[0];
	$: selectedTextStyle.fontFamily &&
		(selectedFontObject =
			text_fonts.find((font) => font.value == selectedTextStyle.fontFamily) || text_fonts[0]);

	$: console.log(selectedFontObject);
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="mr-0 h-[2rem] w-[100px] justify-between gap-y-1 rounded-r-none pr-[6px]"
		>
			{selectedFontObject.label}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input placeholder="Vælg font..." />
			<Command.Empty>Ingen font fundet.</Command.Empty>
			<Command.Group>
				{#each text_fonts as font}
					<Command.Item
						value={font.value}
						onSelect={(currentValue) => {
							value = currentValue;
							closeAndFocusTrigger(ids.trigger);
							handleTextFontSelection({ value: currentValue });
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', value !== font.value && 'text-transparent')} />
						{font.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
