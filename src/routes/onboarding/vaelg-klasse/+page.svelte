<script lang="ts">
	import {
		Command,
		CommandInput,
		CommandEmpty,
		CommandGroup,
		CommandItem,
		CommandList
	} from '@/components/ui/command';
	import { canProceed, selectedClassId, selectedSchoolId } from '../onboardingStores';
	import { School, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import api from '@/api';

	canProceed.set($selectedClassId != '');

	let classes = [];

	onMount(async () => {
		classes = await (await api.getSchoolClasses($selectedSchoolId)).json();
		console.log(classes);
	});

	function selectClass(classId) {
		canProceed.set(true);

		selectedClassId.set(classId);
		selectedClass = classes.find((aclass) => aclass.id === classId).name;

		const el = document.querySelector('input');
		el.blur();
	}

	let focused = false;
	let selectedClass = null;
</script>

<h1>Vælg din klasse</h1>
<div class:small={!focused && $selectedClassId}>
	<Command>
		<CommandInput
			on:focus={() => {
				focused = true;
				selectedClassId.set(null);
			}}
			on:blur={() => (focused = false)}
			placeholder={selectedClass || 'Søg efter din klasse'}
			class={$selectedClassId ? 'placeholder:text-foreground' : ''}
		>
			{#if selectedClassId}
				<School class="mr-2 h-4 w-4 shrink-0 opacity-50" />
			{:else}
				<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
			{/if}
		</CommandInput>
		{#if focused || !$selectedClassId}
			<CommandList>
				<CommandEmpty>Ingen resultater fundet.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					{#each classes as sclass (sclass)}
						<CommandItem onSelect={() => selectClass(sclass.id)}>{sclass.name}</CommandItem>
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
