<script lang="ts">
	import { Assignment, currentFile } from '@/api/apiStore';
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

	let selectedMembers = [];

	let members = ['Emma Johnson', 'Aiden Smith', 'Sophia Davis', 'Liam Wilson', 'Olivia Thompson'];

	let groups = [
		{ id: '', name: '9.A' },
		{ id: 'c4cc331c-09d3-4f8f-aec8-11cf30389773', name: '9.B' },
		{ id: 'hej', name: '9.C' },
		{ id: '', name: '8.A' },
		{ id: '', name: '8.B' },
		{ id: '', name: '8.C' },
		{ id: '', name: '7.A' },
		{ id: '', name: '7.B' },
		{ id: '', name: '7.C' }
	];

	$: updateServerSideSelectedMembers(selectedMembers);

	function updateServerSideSelectedMembers(selectedMembers) {
		($currentFile as Assignment).updateInfo({
			asigned_groups_ids: selectedMembers.map((member) => member.id).filter((id) => id)
		});
	}
	function addMember(member) {
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
							{member.name}
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
						<CommandItem onSelect={() => addMember(group)}>{group.name}</CommandItem>
					{/each}
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Elever">
					{#each members as member}
						<CommandItem
							on:click={() => addMember({ name: member, id: null })}
							onSelect={() => addMember({ name: member, id: null })}>{member}</CommandItem
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
