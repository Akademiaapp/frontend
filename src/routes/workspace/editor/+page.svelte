<script lang="ts">
	import Toolbar from './Toolbar/Toolbar.svelte';
	import FileEditor from './FileEditor.svelte';
	import api from '@/api';
	import type { Readable } from 'svelte/store';
	import type { Editor } from 'svelte-tiptap';
	import { goto } from '$app/navigation';
	import {
		Assignment,
		AssignmentAnswer,
		currentFile,
		DocumentInfo,
		documentStore,
		FileInfo
	} from '@/api/apiStore';

	let editor: Readable<Editor>;

	var urlParams = new URLSearchParams(window.location.search);
	var id = urlParams.get('id');
	var documentType = id.split('.')[0];

	if (!id) {
		goto('/workspace/home');
	}

	if (!$currentFile) {
		console.log('curr', $currentFile);
		api.getDocument(id).then((file) => {
			if (!file) return;
			file.json().then((fileContent) => {
				console.log('hey!', fileContent);
				console.log('What??', id);
				console.log('What????', documentType);
				fileContent.id = id.split('.')[1];

				if (documentType === 'document') {
					currentFile.set(new DocumentInfo(fileContent));
				} else if (documentType === 'assignmentAnswer') {
					currentFile.set(new AssignmentAnswer(fileContent));
				} else if (documentType === 'assignment') {
					currentFile.set(new Assignment(fileContent));
				}
			});
		});
	}
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
