<script lang="ts">
	import File from './File.svelte';
	import api from '$lib/api';

	import SideBarElem from './SideBarElem.svelte';
	import randomName from '$lib/randomName';
	import { DocumentInfo, currentFile, documentStore } from '@/api/apiStore';
	import Document from '../home/activeFiles/Document.svelte';

	export let files: DocumentInfo[] = $documentStore;

	$: files = $documentStore;
</script>

<div class="cont br-2 float-panel">
	<div class="files br-2">
		{#each files as file}
			<div>
				<File
					name={file?.name}
					onClick={() => {
						currentFile.set(file);
					}}
					active={file?.id == $currentFile?.id}
					id={file?.id}
				></File>
			</div>
			<!-- content here -->
		{/each}
	</div>
	<div class="splitter"></div>
	<SideBarElem active={false}>
		<button
			on:click={async () => {
				const newFile = await api.createDocument('Uden titel').then((response) => {
					if (!response) return;
					return response.json();
				});
				currentFile.set(new DocumentInfo(newFile));

				console.log(newFile);
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

	.files {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 1.05rem;
		overflow-y: auto;
	}

	button {
		display: flex;
		gap: 0.25rem;
		justify-self: end;
	}
</style>
