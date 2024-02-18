<script lang="ts">
	import Toolbar from './Toolbar/Toolbar.svelte';
	import FileEditor from './FileEditor.svelte';
	import Workspace from '../Workspace.svelte';
	import type { Editor } from '@tiptap/core';
	import { activeFile } from '../../store';
	import { getContext } from 'svelte';
	import ApiHandler from '@/api';
	import type { Readable } from 'svelte/store';
	import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
	import { goto } from '$app/navigation';

	let editor: Editor;
	const api = new ApiHandler(<Readable<AuthorizerState>>getContext('authorizerContext'));

	var urlParams = new URLSearchParams(window.location.search);
	var id = urlParams.get('id');

	if (!id) {
		goto('/workspace/home');
	}

	api.getDocument(id || '').then((file) => {
		file.json().then((fileContent) => {
			activeFile.set(fileContent);
		});
	});
</script>

<svelte:head>
	<title>{$activeFile?.name || 'Editor'} | Akademia</title>
</svelte:head>

<Workspace>
	{#if $activeFile}
		<div class="editor">
			<Toolbar {editor} />

			<FileEditor bind:editor></FileEditor>
		</div>
	{/if}
</Workspace>

<style>
	.editor {
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
