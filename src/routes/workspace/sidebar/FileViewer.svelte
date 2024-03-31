<script lang="ts">
	import FileList from './FileList.svelte';
	import File from './File.svelte';
	import api from '$lib/api';

	import SideBarElem from './SideBarElem.svelte';
	import randomName from '$lib/randomName';
	import {
		DocumentInfo,
		FileInfo,
		Folder,
		currentFile,
		documentStore,
		newDocument
	} from '@/api/apiStore';
	import FolderItem from './FolderItem.svelte';
	import Document from '../home/activeFiles/Document.svelte';
	import { onMount, tick } from 'svelte';
	import Category from './Category.svelte';

	const testFiles = [
		new FileInfo({
			id: '1',
			name: 'Noget',
			data: '1',
			created: new Date().toDateString(),
			updated: new Date().toDateString()
		}),
		new FileInfo({
			id: '1',
			name: 'ABC',
			data: '1',
			created: new Date().toDateString(),
			updated: new Date().toDateString()
		})
	];

	export let folders: Folder[] = [
		new Folder({
			name: 'Dansk',
			emoji: '🇩🇰',
			subFolders: [],
			files: testFiles
		}),
		new Folder({
			name: 'Engelsk',
			emoji: '🇬🇧',
			subFolders: [],
			files: testFiles
		}),
		new Folder({
			name: 'Fransk',
			emoji: '🇫🇷',
			subFolders: [],
			files: testFiles
		}),
		new Folder({
			name: 'Matematik',
			emoji: '📊',
			subFolders: [],
			files: testFiles
		}),
		new Folder({
			name: 'Fysik/Kemi',
			emoji: '⚛️',
			subFolders: [],
			files: testFiles
		}),
		new Folder({
			name: 'Biologi',
			emoji: '🌱',
			subFolders: [],
			files: testFiles
		}),
		new Folder({
			name: 'Historie',
			emoji: '🏛️',
			subFolders: [],
			files: testFiles
		}),
		new Folder({
			name: 'Samfundsfag',
			emoji: '🌍',
			subFolders: [],
			files: testFiles
		})
	];

	$: files = $documentStore;

	let atBottom = true;

	function onscroll(event) {
		const { scrollHeight, scrollTop, clientHeight } = event.target;
		console.log(scrollHeight, scrollTop, clientHeight, scrollHeight - scrollTop - clientHeight);
		atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
	}

	let filesElem;

	documentStore.subscribe(async (value) => {
		await tick();
		onscroll({ target: filesElem });
	});
</script>

<div class="cont br-2 float-panel">
	<div class="files sidebar-scroll p-1" on:scroll={onscroll} bind:this={filesElem}>
		<Category name="Fag" open={false} {folders}></Category>
		<Category name="Andet" {files}></Category>
	</div>
	<div class="splitter"></div>
	<div class="z-10 p-1 shadow-black transition-shadow duration-500" class:shadow-2xl={!atBottom}>
		<SideBarElem active={false}>
			<button on:click={() => newDocument('Uden titel')} class="reset no-bg size-full">
				<span class="material-symbols-rounded icon-w-2">add</span>
				<span>Ny fil</span>
			</button>
		</SideBarElem>
	</div>
</div>

<style lang="scss">
	.splitter {
		flex: 1;
	}
	.cont {
		display: flex;
		flex-direction: column;

		font-size: 1.05rem;
		color: var(--color-text-2);
		background-color: var(--color-bg-1);

		flex-grow: 1;
		overflow-y: hidden;
	}

	.files {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 1.05rem;
		overflow-y: auto;
	}
	:global(.sidebar-scroll) {
		&::-webkit-scrollbar {
			height: 0;
			width: 10px;
			background-color: hsl(0, 0%, 0%, 0.04);
			background-color: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background-color: hsl(0, 0%, 0%, 0.1);
		}
	}

	button {
		display: flex;
		gap: 0.25rem;
		justify-self: end;
	}
</style>
