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
	import commandScore from 'command-score';
	import { supabase } from '../../../lib/supabase/supabaseClient';

	canProceed.set($selectedSchoolId != '');

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
		supabase
			.rpc('search_schools_partial', { search_query: query }).then(({ data, error }) => {
				if (error) {
					console.error(error);
					return;
				}

				searchedSchools = data;
			})
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
