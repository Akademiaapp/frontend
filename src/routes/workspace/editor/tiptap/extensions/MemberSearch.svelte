<script>
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

	let focused = false;
	$: console.log(value);

	let value;
</script>

<Command class="grid overflow-visible">
	<div
		class={`absolute box-content w-[400px] rounded-md border-input bg-background ${focused && 'border drop-shadow-md'}`}
	>
		<CommandInput
			placeholder="Type a command or search..."
			on:focus={() => {
				focused = true;
			}}
			on:blur={() => {
				focused = false;
			}}
			bind:value
			wrapperClass={focused ? 'border-b' : 'border-none'}
		/>
		{#if focused}
			<!-- content here -->

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
		{/if}
	</div>
</Command>
