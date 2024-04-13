<script lang="ts">
	import Emoji from './Emoji.svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { tick } from 'svelte';

	import json from '$lib/emoji/emojis.json';

	export let open = false;
	export let value = '';

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

	function renderedHtmls() {
		if (!renderedHtmlsVal) {
			renderedHtmlsVal = json.map((cat) => {
				const elem = document.createElement('div');

				cat.emojis.forEach((emoji) => {
					const button = document.createElement('button');
					button.innerHTML = `<svg width="25" height="25"><use href="/sprite.svg#${emoji.unicode}"></use></svg>`;
					button.addEventListener('click', () => {
						value = emoji.char;
						closeAndFocusTrigger('trigger');
					});
					elem.appendChild(button);
				});
				return elem;
			});
		}
		return renderedHtmlsVal;
	}

	let renderedHtmlsVal = null;

	$: if (open && searchVal === '') {
		tick().then(() => {
			renderedHtmls().forEach((html, i) => {
				if (i === 0) {
					let elem = document.querySelector(`.heji${i}`);
					if (elem) {
						// elem.appendChild(html);
						elem.replaceWith(html);
					}
				} else {
					setTimeout(
						() => {
							let elem = document.querySelector(`.heji${i}`);
							if (elem) {
								elem.replaceWith(html);
							}
						},
						10 * (i - 1)
					);
				}
			});
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="ghost"
			class="h-7 w-7 p-1 text-lg hover:bg-foreground/20 {open ? 'bg-foreground/10' : ''}"
			size="icon"
			role="combobox"
			aria-expanded={open}
		>
			{#if value}
				<Emoji emoji={value} />
			{/if}
		</Button>
	</Popover.Trigger>

	<!-- content here -->
	<Popover.Content side="right" sideOffset={10} class="w-auto p-0">
		<Command.Root>
			<Command.Input bind:value={searchVal} placeholder="Search framework..." />
			<div class="content max-h-[400px] overflow-y-auto overflow-x-clip">
				{#if searchVal == ''}
					{#each json as category, i}
						<Command.Group heading={category.name}>
							<div class="group heji{i}" role="group"></div>
						</Command.Group>
						<Command.Separator />
					{/each}
				{:else}
					<div class="group" role="group">
						<div>
							{#each json as category}
								{#each category.emojis.filter( (e) => e.name.includes(searchVal) ) as emoji (emoji.unicode)}
									<button
										on:click={() => {
											value = emoji.char;
											closeAndFocusTrigger(ids.trigger);
										}}
									>
										<svg width="25" height="25">
											<use href={`/sprite.svg#${emoji.unicode}`}>
												<title>{emoji.name}</title>
											</use>
										</svg>
									</button>
								{/each}
							{/each}
						</div>
					</div>
				{/if}
			</div>
			<!-- <Command.Empty>No framework found.</Command.Empty> -->
		</Command.Root>
	</Popover.Content>
</Popover.Root>

<style lang="scss">
	.cont {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.group {
		padding: 0.25rem;
	}

	.content :global([role='group'] div) {
		/* max-height: 200px; */

		display: grid;
		grid-template-columns: repeat(13, 1fr);
		flex-wrap: wrap;

		max-width: 100%;

		:global(button) {
			padding: 0.2rem;
			border-radius: 0.25rem;
			&:hover {
				background-color: rgb(var(--rgb), 0.1);
			}
		}
	}
</style>
