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
	<div class="editor br-2">
		<Toolbar {editor} {activeFile} />
		<Tiptap {activeFile} bind:editor />
	</div>
</div>

<style>
	.main {
		flex: 1;
		gap: 0.75rem;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--color-bg-0);
		flex: 1rem;
		padding: 0.75rem;
	}

	.editor {
		flex: 1;
		background-color: var(--color-bg-1);
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
