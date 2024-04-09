<script lang="ts">
	import levenshein from 'js-levenshtein';
	import {
		Command,
		CommandInput,
		CommandEmpty,
		CommandGroup,
		CommandItem,
		CommandList,
		CommandSeparator
	} from '@/components/ui/command';
	import { canProceed, selectedSchoolId } from '../onboardingStores';
	import { School, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import api from '@/api';
	import commandScore from 'command-score';

	canProceed.set($selectedSchoolId != '');

	let schools = [];

	onMount(async () => {
		schools = await (await api.getSchools()).json();
		console.log(schools);
		searchedSchools = schools.splice(0, 20);
	});

	function selectSchool(schoolId, schoolName) {
		console.log('wah', schoolId);
		console.log('wah', schools);
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
			.sort((a, b) => b.distance - a.distance)
			.splice(0, 20);

		console.log(searchedSchools);
	}

	$: search(value);

	let value = '';
</script>

<h1>Vælg din skole</h1>
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
	label {
		cursor: pointer;

		display: flex;

		align-items: center;
		gap: 1rem;

		padding: 0.5rem 1rem;

		border-width: 1px;

		border-radius: 0.25rem;

		// box-sizing: border-box;

		img {
			aspect-ratio: 1;
			height: 3rem;
			width: auto;
		}

		.des {
			font-size: 0.75rem;
			color: var(--color-text-2);
		}

		transition: all 100ms;
	}

	.small {
		height: 2.8rem;
	}

	input[type='radio']:checked + label {
		/* color: #ff0000; Change this to the color you want */
		/* font-weight: bold; Add any other styles you want */

		border: solid 1px var(--color-accent);

		box-shadow: inset 0 0 0 1px var(--color-accent);

		// border: none;
	}

	input {
		display: none;
	}
</style>
