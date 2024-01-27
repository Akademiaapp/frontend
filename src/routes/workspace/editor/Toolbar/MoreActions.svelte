<script lang="ts">
	import DialogDescription from './../../../../lib/components/ui/dialog/dialog-description.svelte';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '@/components/ui/button/button.svelte';
	import { MoreHorizontal, Trash2, LogOut } from 'lucide-svelte';
	import DropdownMenuItem from '@/components/ui/dropdown-menu/dropdown-menu-item.svelte';
	import { Title } from '@/components/ui/card';
	import { activeFile } from '../../../store';
	import { getContext } from 'svelte';
	import type ApiHandler from '@/api';

	let isDeleteOpen = false;

	$: console.log(isDeleteOpen);

	const api = getContext('api') as ApiHandler;
	function deleteActiveFile() {
		const id = $activeFile?.id;
		if (!id) return;
		api.deleteDocument(id);
		isDeleteOpen = false;
		activeFile.set(null);
	}
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
			<DropdownMenu.Item on:click={() => (isDeleteOpen = true)}>
				<Trash2 size="15" strokeWidth="1.5"></Trash2>
				Delete
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<LogOut size="15" strokeWidth="1.5"></LogOut>
			Log out
			<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Dialog bind:open={isDeleteOpen}>
	<Dialog.Content class="max-w-[23rem]">
		<Dialog.Title>Are you sure you want to delete {$activeFile?.name}?</Dialog.Title>
		<Dialog.Description
			>This will permanently delete the file. This action cannot be undone</Dialog.Description
		>
		<div class="flex w-full gap-2">
			<Button variant="outline" class="flex-1" on:click={() => (isDeleteOpen = false)}>No</Button>
			<Button variant="destructive" class="flex-1" on:click={deleteActiveFile}>Yes</Button>
		</div>
	</Dialog.Content>
</Dialog.Dialog>
