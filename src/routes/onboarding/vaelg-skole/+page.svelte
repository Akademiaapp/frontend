<script>
	import {
		Command,
		CommandInput,
		CommandEmpty,
		CommandGroup,
		CommandItem,
		CommandList,
		CommandSeparator
	} from '@/components/ui/command';
	import { canProceed, userType } from '../onboardingStores';

	canProceed.set(false);
</script>

<h1>Vælg din skole</h1>
<Command>
	<CommandInput placeholder="Type a command or search..." />
	<CommandList>
		<CommandEmpty>No results found.</CommandEmpty>
		<CommandGroup heading="Suggestions">
			<CommandItem>Sct. Jørgens skole - Næstved</CommandItem>
			<CommandItem>Aarhus Skt. Pauls Skole</CommandItem>
			<CommandItem>Bagsværd Skole</CommandItem>
			<CommandItem>Birkerød Skole</CommandItem>
			<CommandItem>Christianshavns Skole</CommandItem>
			<CommandItem>Det frie Gymnasium</CommandItem>
			<CommandItem>Espergærde Skole</CommandItem>
			<CommandItem>Frederiksberg Skole</CommandItem>
			<CommandItem>Gefion Gymnasium</CommandItem>
			<CommandItem>Haderslev Realskole</CommandItem>
			<CommandItem>Ingrid Jespersens Skole</CommandItem>
			<CommandItem>Johannes Skole</CommandItem>
			<CommandItem>Kolding Realskole</CommandItem>
			<CommandItem>Lemvig Skole</CommandItem>
			<CommandItem>Mariagerfjord Skole</CommandItem>
			<CommandItem>Niels Steensens Skole</CommandItem>
			<CommandItem>Odense Skt. Hans Skole</CommandItem>
			<CommandItem>Paderup Skole</CommandItem>
			<CommandItem>Qaqortoq Skole</CommandItem>
			<CommandItem>Roskilde Lilleskole</CommandItem>
			<CommandItem>Sankt Annæ Skole</CommandItem>
			<CommandItem>Tornbjerg Skole</CommandItem>
			<CommandItem>Usserød Skole</CommandItem>
			<CommandItem>Viborg Skole</CommandItem>
			<CommandItem>Westend Skole</CommandItem>
		</CommandGroup>
	</CommandList>
</Command>

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

	input[type='radio']:checked + label {
		/* color: #ff0000; Change this to the color you want */
		/* font-weight: bold; Add any other styles you want */

		border: solid 1px var(--color-accent-1);

		box-shadow: inset 0 0 0 1px var(--color-accent-1);

		// border: none;
	}

	input {
		display: none;
	}
</style>
