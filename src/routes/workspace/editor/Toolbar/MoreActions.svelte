<script lang="ts">
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '@/components/ui/button/button.svelte';
	import {
		MoreHorizontal,
		Trash2,
		Download,
		Printer,
		Users,
		NotebookPen,
		File
	} from 'lucide-svelte';
	import { currentFile } from '@/api/apiStore';
	import { printUsingWindow } from '@/utils/printer';
	import { assignmentAnswers, assignments, documents } from '@/supabase/supabaseClient';
	let isDeleteOpen = false;
	export let is_note = false;

	function deleteActiveFile() {
		if (!$currentFile) return;

		if ('due_date' in $currentFile) {
			assignments.delete($currentFile.id);
		} else if ('feedback_id' in $currentFile) {
			assignmentAnswers.delete($currentFile.id);
		} else if ('is_note' in $currentFile) {
			documents.delete($currentFile.id);
		}
		currentFile.set(null);
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

	export let isShareOpen;
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
					<DropdownMenu.Item on:click={printFile}>PDF</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Item on:click={printFile}>
				<Printer size="15" strokeWidth="1.5"></Printer>
				Print
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item on:click={() => (isShareOpen = true)}>
				<Users size="15" strokeWidth="1.5"></Users>
				Inviter
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			{#if is_note}
				<DropdownMenu.Item>
					<File size="15" stroke-width="1.5" />
					Konvertér til dokument
				</DropdownMenu.Item>
			{:else}
				<DropdownMenu.Item>
					<NotebookPen size="15" stroke-width="1.5" />
					Konvertér til note
				</DropdownMenu.Item>
			{/if}
			<DropdownMenu.Item on:click={() => (isDeleteOpen = true)}>
				<Trash2 size="15" strokeWidth="1.5"></Trash2>
				Slet
			</DropdownMenu.Item>
		</DropdownMenu.Group>
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
