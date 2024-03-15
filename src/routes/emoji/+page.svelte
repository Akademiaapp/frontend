<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';

	import { data } from '@/emoji/data-by-group';

	console.log(data[0]);
	let emojiStr =
		'😀😃😄😁😆😅😂🤣🥲🥹☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥸🤩🥳😏😒😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😮‍💨😤😠😡🤬🤯😳🥵🥶😱😨😰😥😓🫣🤗🫡🤔🫢🤭🤫🤥😶😶‍🌫️😐😑😬🫨🫠🙄😯😦😧😮😲🥱😴🤤😪😵😵‍💫🫥🤐🥴🤢🤮🤧😷🤒🤕🤑🤠😈👿👹👺🤡💩👻💀☠️👽👾🤖🎃😺😸😹😻😼😽🙀😿😾';

	let emojiList = [...emojiStr];
	const frameworks = data[0].emojis.map((emoji) => ({
		value: emoji.name,
		label: emoji.emoji
	}));

	// const frameworks = [
	// 	{
	// 		value: 'hej med dig',
	// 		label: '😀'
	// 	},
	// 	{
	// 		value: 'du er dum',
	// 		label: '😇'
	// 	},
	// 	{
	// 		value: 'jeg er klog',
	// 		label: '😍'
	// 	}
	// ];

	let open = false;
	let value = '';

	$: selectedValue = frameworks.find((f) => f.value === value)?.label ?? 'Select a framework...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<div class="cont">
	<Popover.Root bind:open let:ids>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="w-[200px] justify-between"
			>
				{selectedValue}
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[200px] p-0">
			<Command.Root>
				<Command.Input placeholder="Search framework..." />
				<Command.Empty>No framework found.</Command.Empty>
				<Command.Group data-cmdk-group-items>
					{#each frameworks as framework}
						<Command.Item
							class="p-1.5"
							value={framework.value}
							onSelect={(currentValue) => {
								value = currentValue;
								closeAndFocusTrigger(ids.trigger);
							}}
						>
							{framework.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</div>

<style>
	.cont {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	:global([role='group']) {
		/* max-height: 200px; */

		display: flex;
		flex-wrap: wrap;

		max-width: 100%;
	}
</style>
