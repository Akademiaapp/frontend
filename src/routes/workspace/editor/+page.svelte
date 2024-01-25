<script lang="ts">
	import Toolbar from './Toolbar.svelte';
	import FileEditor from './FileEditor.svelte';
	import Workspace from '../Workspace.svelte';
	import type { Editor } from '@tiptap/core';
	import Overview from './Overview.svelte';
	import { activeFile } from '../../store';

	let editor: Editor;

	var urlParams = new URLSearchParams(window.location.search);
	var id = urlParams.get('id');
	console.log(id);
</script>

<svelte:head>
	<title>{$activeFile?.name} | Akademia</title>
</svelte:head>

<Workspace>
	<div class="editor">
		<Toolbar {editor}/>

		<FileEditor bind:editor></FileEditor>
	</div>
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
