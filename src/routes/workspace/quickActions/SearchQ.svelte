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
				<Command.Item
					onSelect={() => {
						file.open();
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

<style lang="scss">
	.background {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.4);
		// backdrop-filter: blur(100px);
		z-index: 100;
		display: flex;
		/* align-items: center; */
		align-items: self-start;
		justify-content: center;
	}

	.search {
		margin: 5rem;
		margin-top: 20vh;
		background-color: var(--color-bg-1);
		box-shadow: 0.1 0.1rem 1rem rgba(0, 0, 0, 0.1);
		max-width: 35rem;
		width: 100%;
	}

	.search-bar {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 1.2rem;

		img {
			height: 2rem;
			filter: invert(var(--invert-0));
		}
	}

	input {
		padding: 0;
		font-size: 1.5rem;
		background-color: transparent;
		border: none;
		width: 100%;

		&:focus {
			outline: none;
		}

		&::placeholder {
			color: var(--color-text-2);
		}
	}
</style>
