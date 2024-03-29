<script lang="ts">
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator
	} from '@/components/ui/command';
	import Input from '@/components/ui/input/input.svelte';
	import { AlignHorizontalSpaceBetween, X } from 'lucide-svelte';

	let focused = false;
	$: console.log(value);

	let value: string;

	let selectedMembers: string[] = ['9.A'];

	let members = ['Emma Johnson', 'Aiden Smith', 'Sophia Davis', 'Liam Wilson', 'Olivia Thompson'];

	let groups = ['9.A', '9.B', '9.C', '8.A', '8.B', '8.C', '7.A', '7.B', '7.C'];

	function addMember(member: string) {
		if (!selectedMembers.includes(member)) {
			selectedMembers = [...selectedMembers, member];
		}
		value = '';
	}
</script>

<Command class="grid overflow-visible border-none">
	<div
		class={`absolute box-content w-[400px] rounded-md border-input bg-background ${focused && 'border drop-shadow-md'}`}
	>
		<CommandInput
			placeholder={'Tilføj klasser eller elever'}
			on:focus={() => {
				focused = true;
			}}
			on:blur={() => {
				focused = false;
			}}
			bind:value
			wrapperClass={focused ? 'border-b' : 'border-none'}
		>
			{#each selectedMembers as member}
				<!-- content here -->
				<div class="mr-2 flex gap-1">
					<div class="selectedMemeber">
						<button
							class="reset"
							on:click={() => {
								selectedMembers = selectedMembers.filter((item) => item !== member);
							}}
						>
							<X size="10"></X>
						</button>
						<p>
							{member}
						</p>
					</div>
				</div>
			{/each}
		</CommandInput>
		{#if focused}
			<!-- content here -->

			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Grupper">
					{#each groups as group}
						<CommandItem onSelect={() => addMember(group)}>{group}</CommandItem>
					{/each}
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Elever">
					{#each members as member}
						<CommandItem on:click={() => addMember(member)} onSelect={() => addMember(member)}
							>{member}</CommandItem
						>
					{/each}
				</CommandGroup>
			</CommandList>
		{/if}
	</div>
</Command>

<style lang="scss">
	.selectedMemeber {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.2rem 0.5rem;
		border-radius: 0.5rem;
		background-color: var(--color-bg-2);
		/* height: 2rem; */
		color: var(--color-text-1);

		max-width: 7rem;

		&:hover {
			max-width: 13rem;
		}

		p {
			white-space: nowrap;
			margin: 0;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>
