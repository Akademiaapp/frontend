<script lang="ts">
	import Toolbar from './Toolbar.svelte';
	import FileEditor from './FileEditor.svelte';
	import Workspace from '../Workspace.svelte';
	import type { Editor } from '@tiptap/core';

	let editor: Editor;

	let activeFile: string;
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
		margin-top: var(--pad);

		transition: all 300ms;
	}
</style>
