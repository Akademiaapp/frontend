<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import QuickAction from './QuickAction.svelte';
	import fadeScale from '$lib/transitions/fade-scale';
	import { getContext, setContext, tick } from 'svelte';
	import { expoOut, quadIn, quadInOut, quadOut, sineInOut, sineOut } from 'svelte/easing';
	import * as Command from '$lib/components/ui/command';
	import { fileStore, type FileInfo } from '@/api/apiStore';
	import { goto } from '$app/navigation';
	import { BookPlus, File, FilePen, FilePlus2, NotebookPen, Plus } from 'lucide-svelte';
	import { CalendarPlus } from 'lucide-svelte';
	import type ApiHandler from '@/api';
	import randomName from '@/randomName';
	import { currentFile } from '../../store';
	let isSeaching = false;

	const api = getContext('api') as ApiHandler;

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
</script>

<QuickAction icon="search" action={() => (isSeaching = true)} active={isSeaching}></QuickAction>

<Command.Dialog bind:open={isSeaching}>
	<Command.Input placeholder="Indtast en kommando eller søg..." />
	<Command.List>
		<Command.Empty>Ingen resultater.</Command.Empty>
		<Command.Group heading="Filer">
			{#each $fileStore as file}
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
