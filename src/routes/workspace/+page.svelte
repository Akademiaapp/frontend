<script lang="ts">
	import Toolbar from './Toolbar.svelte';
	import Tiptap from './Tiptap.svelte';
	import Layout from '../+layout.svelte';
	import { isThemeChecked } from '../store';
	import Sidebar from './Sidebar.svelte';
	import type { Editor } from '@tiptap/core';

	let editor: Editor;

	let activeFile: string;
</script>

<div class="main">
	<Sidebar bind:activeFile></Sidebar>
	<div class="editor">
		<Toolbar {editor} {activeFile} />
		<Tiptap {activeFile} bind:editor />
	</div>
</div>

<style>
	.main {
		height: 100%;
		flex: 1;
		width: 100%;
		display: flex;
	}

	.editor {
		flex: 1;
		background-color: var(--color-bg-0);

		display: flex;
		flex-direction: column;
	}
</style>
