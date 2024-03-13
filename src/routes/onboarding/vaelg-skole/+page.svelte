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
			<CommandItem>Calendar</CommandItem>
			<CommandItem>Search Emoji</CommandItem>
			<CommandItem>Calculator</CommandItem>
		</CommandGroup>
		<CommandSeparator />
		<CommandGroup heading="Settings">
			<CommandItem>Profile</CommandItem>
			<CommandItem>Billing</CommandItem>
			<CommandItem>Settings</CommandItem>
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
