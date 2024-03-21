<script lang="ts">
	import Toolbar from './Toolbar/Toolbar.svelte';
	import FileEditor from './FileEditor.svelte';
	import Workspace from '../+layout.svelte';
	import { getContext } from 'svelte';
	import ApiHandler from '@/api';
	import type { Readable } from 'svelte/store';
	import type { Editor } from 'svelte-tiptap';
	import { goto } from '$app/navigation';
	import { currentFile, FileInfo } from '@/api/apiStore';
	import { userInfo } from '../../../authStore';

	let editor: Readable<Editor>;
	const api = new ApiHandler($userInfo);

	var urlParams = new URLSearchParams(window.location.search);
	var id = urlParams.get('id');

	if (!id) {
		goto('/workspace/home');
	}

	api.getDocument(id || '').then((file) => {
		if (!file) return;
		file.json().then((fileContent) => {
			console.log(fileContent);
			currentFile.set(new FileInfo(fileContent));
		});
	});
</script>

<svelte:head>
	<title>{$currentFile?.name || 'Editor'} | Akademia</title>
</svelte:head>

{#if $currentFile}
	<div class="editor">
		<Toolbar />
		<FileEditor />
	</div>
{/if}

<style>
	.editor {
		height: 100%;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: calc(100% - 250px);
		gap: 0.75rem;
		/* padding-left: var(--gap); */

		transition: all 300ms;
	}
</style>
