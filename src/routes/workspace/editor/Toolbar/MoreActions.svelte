<script lang="ts">
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '@/components/ui/button/button.svelte';
	import { MoreHorizontal, Trash2, LogOut, Download, Printer } from 'lucide-svelte';
	import { FileInfo, currentFile, documentStore } from '@/api/apiStore';
	import { printUsingWindow } from '@/utils/printer';
	import { keycloakState } from '../../../../authStore';
	let isDeleteOpen = false;

	function deleteActiveFile() {
		console.log($currentFile);
		if (!($currentFile instanceof FileInfo)) return;
		$currentFile.delete().then((response) => {
			if (!response || response.status !== 200) return;
			console.log(response);
			documentStore.update((prev) => prev.filter((it) => it !== $currentFile));
			currentFile.set(null);
		});
		isDeleteOpen = false;
	}

	function printFile() {
		printUsingWindow(document.getElementById('pages')?.innerHTML);
		// print({
		// 	printable: 'pages',
		// 	type: 'html',
		// 	css: ['/css/styles.css', '/css/tiptap-styles.scss']
		// });
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
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<Download size="15" strokeWidth="1.5"></Download>
					Eksport
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item>Word</DropdownMenu.Item>
					<DropdownMenu.Item>PDF</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Item on:click={printFile}>
				<Printer size="15" strokeWidth="1.5"></Printer>
				Print
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item on:click={() => (isDeleteOpen = true)}>
				<Trash2 size="15" strokeWidth="1.5"></Trash2>
				Slet
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />

		<DropdownMenu.Item on:click={() => $keycloakState.logout()}>
			<LogOut size="15" strokeWidth="1.5"></LogOut>
			Log ud
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Dialog bind:open={isDeleteOpen}>
	<Dialog.Content class="max-w-[23rem]">
		<Dialog.Title>Er du sikker på, at du vil slette {$currentFile?.name}?</Dialog.Title>
		<Dialog.Description
			>Dette sletter filen permanent. Denne handling kan ikke fortrydes</Dialog.Description
		>
		<div class="flex w-full gap-2">
			<Button variant="outline" class="flex-1" on:click={() => (isDeleteOpen = false)}>Nej</Button>
			<Button variant="destructive" class="flex-1" on:click={deleteActiveFile}>Ja</Button>
		</div>
	</Dialog.Content>
</Dialog.Dialog>
