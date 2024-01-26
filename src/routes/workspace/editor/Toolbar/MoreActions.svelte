<script>
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '@/components/ui/button/button.svelte';
	import { MoreHorizontal, Trash2, LogOut } from 'lucide-svelte';
	import DropdownMenuItem from '@/components/ui/dropdown-menu/dropdown-menu-item.svelte';

	let isDeleteOpen = false;

	$: console.log(isDeleteOpen);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			variant="floating"
			builders={[builder]}
			class="br-2 toolbar-bar flex aspect-square h-auto !px-2"
		>
			<MoreHorizontal size={17}></MoreHorizontal>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Group>
			<
				onSelect={() => {
					isDeleteOpen = !isDeleteOpen;
				}}
			>
				<Trash2 size="15" strokeWidth="1.5"></Trash2>
				Delete
			</>

			<Dialog.Dialog>
				<Dialog.Content>
					<h1>hej</h1>
				</Dialog.Content>
			</Dialog.Dialog>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<LogOut size="15" strokeWidth="1.5"></LogOut>
			Log out
			<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
