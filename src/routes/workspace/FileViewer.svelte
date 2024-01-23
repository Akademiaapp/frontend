<script lang="ts">
	import { Document } from '@tiptap/extension-document';
	import File from './File.svelte';
	import ApiHandler from '$lib/api';

	import { getContext, onMount } from 'svelte';
	import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
	import type { Readable } from 'svelte/store';
	import SideBarElem from './SideBarElem.svelte';
	import randomName from '$lib/randomName';
	import { fileStore, type FileInfo, updateFiles } from '@/api/fileHandler';

	const api = new ApiHandler(<Readable<AuthorizerState>>getContext('authorizerContext'));

	export let files: FileInfo[] = $fileStore;

	$: files = $fileStore;
	export let activeFile = '';
	export let activeFilename = '';
</script>

<div class="cont br-2 float-panel">
	{#each files as file}
		<div>
			<File
				name={file?.name}
				onClick={() => {
					activeFile = file?.id;
					activeFilename = file?.name;
				}}
				active={file?.id == activeFile}
				id={file?.id}
			></File>
		</div>
		<!-- content here -->
	{/each}
	<div class="splitter"></div>
	<SideBarElem active={false}>
		<button
			on:click={() => {
				api.createDocument(randomName());
			}}
			class="reset no-bg size-full"
		>
			<span class="material-symbols-rounded icon-w-2">add</span>
			<span>New file</span>
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
	}

	button {
		display: flex;
		gap: 0.25rem;
		justify-self: end;
	}
</style>
