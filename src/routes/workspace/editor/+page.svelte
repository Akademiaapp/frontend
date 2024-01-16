<script lang="ts">
	import Toolbar from './Toolbar.svelte';
	import FileEditor from './FileEditor.svelte';
	import Workspace from '../Workspace.svelte';
	import type { Editor } from '@tiptap/core';

	let editor: Editor;

	var urlParams = new URLSearchParams(window.location.search);
	var id = urlParams.get('id');
	console.log(id)

	let activeFile: string = id || "";
	let activeFilename: string;
</script>

<Workspace bind:activeFile bind:activeFilename>
	<div class="editor">
		<Toolbar {editor} {activeFile} />
		<FileEditor bind:editor {activeFile} {activeFilename}></FileEditor>
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
		padding-left: 0;

		transition: all 300ms;
	}
</style>
