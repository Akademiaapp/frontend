<script lang="ts">
	import { folders } from './../../sidebarStore';
	import FileList from './FileList.svelte';
	import File from './File.svelte';
	import api from '$lib/api';

	import SideBarElem from '../../SideBarElem.svelte';
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
	import Document from '../../../home/activeFiles/Document.svelte';
	import { onMount, tick } from 'svelte';
	import Category from './Category.svelte';

	$: files = $documentStore;

	let atBottom = true;

	function onscroll(event) {
		if (!event.target) return;
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

<div class="cont">
	<div class="files sidebar-scroll p-1" on:scroll={onscroll} bind:this={filesElem}>
		<Category name="Fag" open={false} folders={$folders}></Category>
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

		// max-height: calc(100% - 4rem);

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
