<script lang="ts">
	import File from './File.svelte';
	import ApiHandler from '$lib/api';

	import { getContext, setContext } from 'svelte';
	import SideBarElem from './SideBarElem.svelte';
	import randomName from '$lib/randomName';
	import { fileStore, type FileInfo } from '@/api/apiStore';
	import { activeFile } from '../store';

	const api = getContext('api') as ApiHandler;

	export let files: FileInfo[] = $fileStore;

	$: files = $fileStore;
</script>

<div class="cont br-2 float-panel">
	<div class="files br-2">
		{#each files as file}
			<div>
				<File
					name={file?.name}
					onClick={() => {
						activeFile.set(file);
					}}
					active={file?.id == $activeFile?.id}
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
				const newFile = await (await api.createDocument(randomName())).json();
				activeFile.set(newFile);
				fileStore.update((before) => [...before, newFile]);
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
