<script lang="ts">
	import QuickAction from './QuickAction.svelte';
	import * as Command from '$lib/components/ui/command';
	import { newDocument, openFile } from '@/api/helpers';
	import { File, FilePen, NotebookPen } from 'lucide-svelte';
	import { documents } from '@/supabase/supabaseClient';
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

	export let tooltip = '';
</script>

<QuickAction icon="search" {tooltip} action={() => (isSeaching = true)} active={isSeaching}
></QuickAction>

<Command.Dialog bind:open={isSeaching}>
	<Command.Input placeholder="Indtast en kommando eller søg..." />
	<Command.List>
		<Command.Empty>Ingen resultater.</Command.Empty>
		<Command.Group heading="Filer">
			{#each $documents as file}
				<Command.Item
					onSelect={() => {
						openFile(file.id, 'document'); // TODO not sure if this is correct
						isSeaching = false;
					}}
				>
					<File strokeWidth={1.5}></File>
					{file.name}
				</Command.Item>
				<!-- content here -->
			{/each}
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Kommandoer">
			<Command.Item
				onSelect={() => {
					newDocument('Uden titel', true, false);
					isSeaching = false;
				}}
			>
				<FilePen strokeWidth={1.5}></FilePen>
				Nyt dokument
			</Command.Item>
			<Command.Item
				onSelect={() => {
					newDocument('Uden titel', true, true);
					isSeaching = false;
				}}
			>
				<NotebookPen strokeWidth={1.5}></NotebookPen>
				Ny note
			</Command.Item>
			<!-- <Command.Item>
				<BookPlus strokeWidth={1.5}></BookPlus>
				Nyt project
			</Command.Item>
			<Command.Item>
				<CalendarPlus strokeWidth={1.5}></CalendarPlus>
				Nyt kalender event
			</Command.Item> -->
		</Command.Group>
	</Command.List>
</Command.Dialog>
