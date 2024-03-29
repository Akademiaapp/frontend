<script lang="ts">
	import File from './File.svelte';
	import api from '$lib/api';

	import SideBarElem from './SideBarElem.svelte';
	import randomName from '$lib/randomName';
	import { DocumentInfo, currentFile, documentStore, newDocument } from '@/api/apiStore';
	import Document from '../home/activeFiles/Document.svelte';
	import { onMount } from 'svelte';

	export let files: DocumentInfo[] = $documentStore;

	$: files = $documentStore;

	let atBottom = true;

	function onscroll(event) {
		const { scrollHeight, scrollTop, clientHeight } = event.target;
		atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
	}
</script>

<div class="cont br-2 float-panel">
	<div class="files br-2 p-1" on:scroll={onscroll}>
		{#each files as file}
			<div>
				<File
					{file}
					onClick={() => {
						file.open();
					}}
					active={file?.id == $currentFile?.id}
				></File>
			</div>
			<!-- content here -->
		{/each}
	</div>
	<div class="splitter"></div>
	<div class="z-10 p-1 shadow-black transition-shadow duration-500" class:shadow-2xl={!atBottom}>
		<SideBarElem active={false}>
			<button on:click={() => newDocument('Uden title')} class="reset no-bg size-full">
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
		width: 300px;

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
