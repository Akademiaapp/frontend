<script lang="ts">
	import FileList from './FileList.svelte';
	import File from './File.svelte';
	import ApiHandler from '$lib/api';

	import { getContext, setContext } from 'svelte';
	import SideBarElem from './SideBarElem.svelte';
	import randomName from '$lib/randomName';
	import { DocumentInfo, FileInfo, Folder, currentFile, documentStore } from '@/api/apiStore';
	import FolderItem from './FolderItem.svelte';

	const api = getContext('api') as ApiHandler;

	export let folders: Folder[] = [
		new Folder({
			name: 'test-1',
			subFolders: [],
			files: [
				new FileInfo({
					id: '1',
					name: 'test-1',
					data: '1',
					created: new Date().toDateString(),
					updated: new Date().toDateString()
				}),
				new FileInfo({
					id: '1',
					name: 'test-2',
					data: '1',
					created: new Date().toDateString(),
					updated: new Date().toDateString()
				})
			]
		})
	];

	export let files: DocumentInfo[] = [
		new FileInfo({
			id: '1',
			name: 'test-1',
			data: '1',
			created: new Date().toDateString(),
			updated: new Date().toDateString()
		}),
		new FileInfo({
			id: '1',
			name: 'test-2',
			data: '1',
			created: new Date().toDateString(),
			updated: new Date().toDateString()
		}),
		new FileInfo({
			id: '1',
			name: 'test-3',
			data: '1',
			created: new Date().toDateString(),
			updated: new Date().toDateString()
		}),
		new FileInfo({
			id: '1',
			name: 'test-4',
			data: '1',
			created: new Date().toDateString(),
			updated: new Date().toDateString()
		})
	];

	// $: files = $documentStore;
</script>

<div class="cont br-2 float-panel">
	<FileList {folders} {files}></FileList>
	<div class="splitter"></div>
	<SideBarElem active={false}>
		<button
			on:click={async () => {
				const newFile = await api.createDocument(randomName()).then((response) => {
					if (!response) return;
					return response.json();
				});
				currentFile.set(newFile);
				documentStore.update((before) => [...before, new DocumentInfo(newFile)]);
			}}
			class="reset no-bg size-full"
		>
			<span class="material-symbols-rounded icon-w-2">add</span>
			<span>Ny fil</span>
		</button>
	</SideBarElem>
</div>

<style>
	.splitter {
		flex: 1;
	}
	.cont {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 1.05rem;
		color: var(--color-text-2);
		background-color: var(--color-bg-1);
		padding: 0.2rem;
		flex-grow: 1;
		overflow-y: hidden;
	}

	button {
		display: flex;
		gap: 0.25rem;
		justify-self: end;
	}
</style>
