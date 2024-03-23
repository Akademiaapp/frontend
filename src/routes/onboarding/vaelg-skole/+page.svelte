<script lang="ts">
	import {
		Command,
		CommandInput,
		CommandEmpty,
		CommandGroup,
		CommandItem,
		CommandList,
		CommandSeparator
	} from '@/components/ui/command';
	import { canProceed, selectedSchool, userType } from '../onboardingStores';
	import { School, Search } from 'lucide-svelte';

	canProceed.set(false);

	let schools = [
		'Sct. Jørgens skole - Næstved',
		'Aarhus Skt. Pauls Skole',
		'Bagsværd Skole',
		'Birkerød Skole',
		'Christianshavns Skole',
		'Det frie Gymnasium',
		'Espergærde Skole',
		'Frederiksberg Skole',
		'Gefion Gymnasium',
		'Haderslev Realskole',
		'Ingrid Jespersens Skole',
		'Johannes Skole',
		'Kolding Realskole',
		'Lemvig Skole',
		'Mariagerfjord Skole',
		'Niels Steensens Skole',
		'Odense Skt. Hans Skole',
		'Paderup Skole',
		'Qaqortoq Skole',
		'Roskilde Lilleskole',
		'Sankt Annæ Skole',
		'Tornbjerg Skole',
		'Usserød Skole',
		'Viborg Skole',
		'Westend Skole'
	];
	function selectSchool(school) {
		canProceed.set(true);
		selectedSchool.set(school);

		const el = document.querySelector('input');
		el.blur();
	}

	let focused = false;
</script>

<h1>Vælg din skole</h1>
<div class:small={!focused && $selectedSchool}>
	<Command>
		<CommandInput
			on:focus={() => {
				focused = true;
				selectedSchool.set(null);
			}}
			on:blur={() => (focused = false)}
			placeholder={$selectedSchool || 'Søg efter din skole'}
			class={$selectedSchool ? 'placeholder:text-foreground' : ''}
		>
			{#if selectedSchool}
				<School class="mr-2 h-4 w-4 shrink-0 opacity-50" />
			{:else}
				<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
			{/if}
		</CommandInput>
		{#if focused || !$selectedSchool}
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					{#each schools as school (school)}
						<CommandItem onSelect={() => selectSchool(school)}>{school}</CommandItem>
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
