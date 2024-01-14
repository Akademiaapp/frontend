<script lang="ts">
	import Toolbar from './Toolbar.svelte';
	import FileEditor from './FileEditor.svelte';
	import Workspace from './Workspace.svelte';
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
