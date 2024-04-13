<script lang="ts">
	import api from '@/api';
	import { currentFile, userInfo } from '@/api/apiStore';
	import { Assignment } from '@/api/fileClasses';
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

	let value: string;

	let groups = [];
	let members = [];
	let selectedGroups = [];
	let selectedMembers = [];

	onMount(async () => {
		groups = await (await api.getSchoolClasses($userInfo.schoolId)).json();
		members = await (await api.getSchoolMembers($userInfo.schoolId)).json();
		selectedGroups = ($currentFile as Assignment).asigned_groups_ids.map((id) => {
			let group = groups.find((group) => group.id == id);
			if (group) return group;
		});
	});

	$: updateServerSideSelectedGroups(selectedGroups);
	$: updateServerSideSelectedMembers(selectedMembers);

	function getIdList(list) {
		// Get the ids and clear undefined values
		return list.map((v) => v?.id).filter((id) => id);
	}

	function updateServerSideSelectedGroups(selected) {
		if (
			$currentFile instanceof Assignment &&
			$currentFile.asigned_groups_ids.toString() != getIdList(selected).toString()
		) {
			$currentFile.updateInfo({
				asigned_groups_ids: getIdList(selected)
			});
		}
	}
	function updateServerSideSelectedMembers(selected) {
		if (
			$currentFile instanceof Assignment &&
			$currentFile.asigned_users_ids.toString() != getIdList(selected).toString()
		) {
			$currentFile.updateInfo({
				asigned_users_ids: getIdList(selected)
			});
		}
	}

	function resetInput() {
		value = '';
		focused = false;
	}

	function addGroup(group) {
		if (!selectedGroups.includes(group)) {
			selectedGroups = [...selectedGroups, group];
		}
		resetInput();
	}

	function addMember(member) {
		if (!selectedMembers.includes(member)) {
			selectedMembers = [...selectedMembers, member];
		}
		resetInput();
	}

	export let editable = true;

	function updateFocus(e) {
		if (!document.getElementById('memberSearch').contains(e.target)) {
			focused = false;
			window.removeEventListener('click', updateFocus);
			value = '';
		}
	}

	$: memberList = [
		['Elever', members.filter((m) => m.type == 'STUDENT')],
		['Lærere', members.filter((m) => m.type == 'TEACHER')],
		['Testere', members.filter((m) => m.type == 'TESTER')]
	];
</script>

<Command class="grid overflow-visible border-none" id="memberSearch">
	<div
		class={`absolute box-content w-[400px] rounded-md border-input bg-background ${focused && 'border drop-shadow-md'}`}
	>
		<CommandInput
			placeholder={'Tilføj klasser eller elever'}
			on:focus={() => {
				focused = true;
				window.addEventListener('click', updateFocus);
			}}
			bind:value
			wrapperClass={focused ? 'border-b' : 'border-none'}
			disabled={!editable}
		>
			{#each [...selectedGroups, ...selectedMembers] as member}
				<!-- content here -->
				<div class="mr-2 flex gap-1">
					<div class="selectedMemeber">
						<button
							class="reset"
							on:click={() => {
								selectedGroups = selectedGroups.filter((item) => item !== member);
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
		</CommandInput>
		{#if focused}
			<CommandList>
				<CommandEmpty>Ingen resultater fundet.</CommandEmpty>
				<CommandGroup heading="Grupper">
					{#each groups as group}
						<CommandItem onSelect={() => addGroup(group)}>{group.name}</CommandItem>
					{/each}
				</CommandGroup>
				{#each memberList as [type, members]}
					<CommandSeparator />
					<CommandGroup heading={type.toString()}>
						{#each members as member}
							<CommandItem
								id={member.id}
								value={`${member.first_name} ${member.last_name} ${type} ${member.email}`}
								onSelect={() =>
									addMember({ name: `${member.first_name} ${member.last_name}`, id: member.id })}
								>{member.first_name} {member.last_name}</CommandItem
							>
						{/each}
					</CommandGroup>
				{/each}
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
