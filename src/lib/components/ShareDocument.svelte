<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { UserRoundPlus } from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';

	let open: boolean;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={'br-2 toolbar-bar absolute right-0 flex h-full px-4 py-2' +
			buttonVariants({ variant: 'floating' })}
	>
		<UserRoundPlus size={17} />
		<span class="text box-border overflow-hidden font-semibold leading-normal">Inviter</span>
	</Dialog.Trigger>
</Dialog.Root>
<Command.Dialog bind:open>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Suggestions">
			<Command.Item>Calendar</Command.Item>
			<Command.Item>Search Emoji</Command.Item>
			<Command.Item>Caclculator</Command.Item>
			<Command.Item>Calcuslatbor</Command.Item>
			<Command.Item>Calcxsulator</Command.Item>
			<Command.Item>Calxcuslator</Command.Item>
			<Command.Item>Calcuxxlsator</Command.Item>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Settings">
			<Command.Item>Profile</Command.Item>
			<Command.Item>Billing</Command.Item>
			<Command.Item>Settings</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
