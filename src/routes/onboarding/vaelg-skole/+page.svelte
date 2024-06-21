<script lang="ts">
	import {
		Command,
		CommandInput,
		CommandEmpty,
		CommandGroup,
		CommandItem,
		CommandList
	} from '@/components/ui/command';
	import { canProceed, selectedSchoolId, userType } from '../onboardingStores';
	import { School, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import commandScore from 'command-score';
	import { supabase } from '../../../lib/supabase/supabaseClient';

	canProceed.set($selectedSchoolId != '');

	let schools = [];

	onMount(async () => {
		schools = (await supabase.from('school').select('id, name, address').order('name', { ascending: true })).data;
		searchedSchools = schools.splice(0, 20);
	});

	function selectSchool(schoolId, schoolName) {
		canProceed.set(true);

		selectedSchoolId.set(schoolId);
		selectedSchool = schoolName;

		const el = document.querySelector('input');
		el.value = '';

		focused = false;
	}

	let focused = false;
	let selectedSchool = null;

	let searchedSchools = [];

	function search(query) {
		searchedSchools = schools
			.map((school) => ({
				...school,
				distance: commandScore(school.name, query)
			}))
			.filter((school) => school.distance > 0)
			.sort((a, b) => b.distance - a.distance)
			.splice(0, 20);
	}

	$: search(value);

	let value = '';
</script>

<h1 class:-mb-1={$userType == 'tester'}>Vælg din skole</h1>
{#if $userType == 'tester'}
	<p class=" text-xs text-muted-foreground">
		Som tester kan du bare vælge en hvilken som helst skole.
	</p>
{/if}
<div class:small={!focused && $selectedSchoolId}>
	<Command shouldFilter={false}>
		<CommandInput
			on:focus={() => {
				focused = true;
				selectedSchoolId.set(null);
				selectedSchool = null;
			}}
			bind:value
			placeholder={selectedSchool || 'Søg efter din skole'}
			class={$selectedSchoolId ? 'placeholder:text-foreground' : ''}
		>
			{#if $selectedSchoolId}
				<School class="mr-2 h-4 w-4 shrink-0 opacity-50" />
			{:else}
				<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
			{/if}
		</CommandInput>
		{#if focused || !$selectedSchoolId}
			<CommandList class="sidebar-scroll">
				{#if searchedSchools.length == 0}
					<CommandEmpty>Ingen resultater fundet.</CommandEmpty>
				{/if}
				<CommandGroup heading="Suggestions">
					{#each searchedSchools as school (school)}
						<CommandItem id={school.id} onSelect={() => selectSchool(school.id, school.name)}>
							<p>
								{school.name}

								<span class="ml-1 text-[0.7rem] text-muted-foreground">{school.address}</span>
							</p>
						</CommandItem>
					{/each}
				</CommandGroup>
			</CommandList>
		{/if}
	</Command>
</div>

<style lang="scss">
	.small {
		height: 2.8rem;
	}
</style>
