<script lang="ts">
	import QuickAction from './QuickAction.svelte';
	import { getContext } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import { currentFile, documentStore, type FileInfo } from '@/api/apiStore';
	import { goto } from '$app/navigation';
	import { BookPlus, File, FilePen, NotebookPen } from 'lucide-svelte';
	import { CalendarPlus } from 'lucide-svelte';
	import api from '@/api';
	import randomName from '@/randomName';
	let isSeaching = false;

	window.addEventListener('keydown', (ev) => {
		if (ev.key == 'p' && ev.ctrlKey) {
			isSeaching = true;
			ev.preventDefault();
		}
		if (ev.key == ' ' && ev.ctrlKey) {
			isSeaching = true;
		}

		if (ev.key == 'Enter') {
			isSeaching = false;
		}
	});

	function openFile(file: FileInfo) {
		goto('editor?id=' + file.id);
		isSeaching = false;
		currentFile.set(file);
	}

	export let tooltip = '';
</script>

<QuickAction icon="search" {tooltip} action={() => (isSeaching = true)} active={isSeaching}
></QuickAction>

<Command.Dialog bind:open={isSeaching}>
	<Command.Input placeholder="Indtast en kommando eller søg..." />
	<Command.List>
		<Command.Empty>Ingen resultater.</Command.Empty>
		<Command.Group heading="Filer">
			{#each $documentStore as file}
				<Command.Item onSelect={() => openFile(file)}>
					<File strokeWidth={1.5}></File>
					{file.name}
				</Command.Item>
				<!-- content here -->
			{/each}
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Kommandoer">
			<Command.Item onSelect={() => api.createDocument(randomName())}>
				<FilePen strokeWidth={1.5}></FilePen>
				Nyt dokument
			</Command.Item>
			<Command.Item>
				<NotebookPen strokeWidth={1.5}></NotebookPen>
				Ny note
			</Command.Item>
			<Command.Item>
				<BookPlus strokeWidth={1.5}></BookPlus>
				Nyt project
			</Command.Item>
			<Command.Item>
				<CalendarPlus strokeWidth={1.5}></CalendarPlus>
				Nyt kalender event
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
