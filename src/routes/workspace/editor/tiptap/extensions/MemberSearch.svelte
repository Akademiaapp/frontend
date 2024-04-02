<script lang="ts">
	import api from '@/api';
	import { Assignment, currentFile, userInfo } from '@/api/apiStore';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
		CommandSeparator
	} from '@/components/ui/command';
	import { X } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let focused = false;
	$: console.log(value);

	let value: string;

	let groups = [];
	let members = [];
	let selectedMembers = [];
	
	onMount(async () => {
		groups = await (await api.getSchoolClasses($userInfo.schoolId)).json();
		members = await (await api.getSchoolMembers($userInfo.schoolId)).json();
		selectedMembers = ($currentFile as Assignment).asigned_groups_ids.map((id) => {
			let group = groups.find((group) => group.id == id);
			if (group) return group;
		});
	});


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
			if (getIdList().length > 0) {
				$currentFile.updateInfo({
					asigned_groups_ids: getIdList()
				});
			}
		}
	}
	function addMember(member) {
		if (!selectedMembers.includes(member)) {
			selectedMembers = [...selectedMembers, member];
		}
		value = '';
	}

	export let editable = true;
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
			disabled={!editable}
		>
			{#if selectedMembers.length > 0}
				{#each selectedMembers as member}
					<!-- content here -->
					<div class="mr-2 flex gap-1">
						<div class="selectedMemeber">
							<button
								class="reset"
								on:click={() => {
									selectedMembers = selectedMembers.filter((item) => item !== member);
								}}
								disabled={!editable}
							>
								<X size="10"></X>
							</button>
							<p>
								{member.name}
							</p>
						</div>
					</div>
				{/each}
			{/if}
		</CommandInput>
		{#if focused}
			<!-- content here -->

			<CommandList>
				<CommandEmpty>Ingen resultater fundet.</CommandEmpty>
				<CommandGroup heading="Grupper">
					{#each groups as group}
						<CommandItem onSelect={() => addMember(group)}>{group.name}</CommandItem>
					{/each}
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Elever">
					{#each members as member}
						<CommandItem
							on:click={() => addMember({ name: (member.first_name + ' ' + member.last_name), id: member.id })}
							onSelect={() => addMember({ name: (member.first_name + ' ' + member.last_name), id: member.id })}>{member.first_name} {member.last_name}</CommandItem
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
