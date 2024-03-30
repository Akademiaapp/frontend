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

	let groups = [
		{ id: '7d11131a-0807-4320-bc8a-d2ceda97f14c', name: '9.A' },
		{ id: 'c4cc331c-09d3-4f8f-aec8-11cf30389773', name: '9.B' },
		{ id: '256cc997-a7e8-4430-a8ce-6f15c216fdf7', name: '9.C' },
		{ id: '8c0ac6c5-573b-4ab9-83b4-5b6dd46e559d', name: '8.A' },
		{ id: 'a2e664f1-7817-4dac-aa56-3ccf9c5774bb', name: '8.B' },
		{ id: '353b815e-53a2-44e0-b2df-b9dab4f53f42', name: '8.C' },
		{ id: 'e6ff82ef-74a6-45a1-bb67-d9096aa3a0f9', name: '7.A' },
		{ id: '2098f083-a0f5-482e-bed1-e593bf8682b6', name: '7.B' },
		{ id: '', name: '7.C' }
	];

	let selectedMembers = ($currentFile as Assignment).asigned_groups_ids.map((id) => {
		let group = groups.find((group) => group.id == id);
		if (group) return group;
	});

	let members = ['Emma Johnson', 'Aiden Smith', 'Sophia Davis', 'Liam Wilson', 'Olivia Thompson'];

	$: updateServerSideSelectedMembers(selectedMembers);
	function getIdList() {
		return selectedMembers.map((member) => member.id).filter((id) => id);
	}

	function updateServerSideSelectedMembers(selectedMembers) {
		if (
			$currentFile instanceof Assignment &&
			$currentFile.asigned_groups_ids.toString() != getIdList().toString()
		) {
			console.log($currentFile.asigned_groups_ids);
			console.log(getIdList());
			console.log($currentFile.asigned_groups_ids == getIdList());
			$currentFile.updateInfo({
				asigned_groups_ids: getIdList()
			});
		}
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
