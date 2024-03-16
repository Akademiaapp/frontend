<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';

	import { data } from '@/emoji/data-by-group';
	import { Group } from 'lucide-svelte';
	import Separator from '@/components/ui/separator/separator.svelte';

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
	$: console.log(value);

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

	let searchVal = '';

	$: console.log(searchVal);
</script>

<div class="cont">
	<Popover.Root bind:open let:ids class="w-auto">
		<Popover.Trigger asChild let:builder>
			<Button builders={[builder]} variant="outline" role="combobox" aria-expanded={open}>
				{value}
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Command.Root>
				<Command.Input bind:value={searchVal} placeholder="Search framework..." />
				<div class="max-h-[400px] overflow-y-auto overflow-x-clip">
					{#if searchVal == ''}
						{#each data as category}
							<Command.Group heading={category.name}>
								{#each category.emojis as emoji}
									<button
										on:click={() => {
											value = emoji.emoji;
											closeAndFocusTrigger(ids.trigger);
										}}
									>
										{emoji.emoji}
									</button>
								{/each}
							</Command.Group>
							<Command.Separator />
						{/each}
					{:else}
						<div class="group" role="group">
							{#each data as category}
								{#each category.emojis.filter((e) => e.name.includes(searchVal)) as emoji}
									<button
										on:click={() => {
											value = emoji.emoji;
											closeAndFocusTrigger(ids.trigger);
										}}
									>
										{emoji.emoji}
									</button>
								{/each}
							{/each}
						</div>
					{/if}
				</div>
				<!-- <Command.Empty>No framework found.</Command.Empty> -->
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
</div>

<style lang="scss">
	.cont {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	button {
		padding: 0.25rem;
	}

	.group {
		padding: 0.25rem;
	}

	:global([role='group']) {
		/* max-height: 200px; */

		display: grid;
		grid-template-columns: repeat(13, 1fr);
		flex-wrap: wrap;

		max-width: 100%;
	}
</style>
