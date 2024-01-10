<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import Toolbar from './Toolbar.svelte';
	import Tiptap from './Tiptap.svelte';
	import Sidebar from './Sidebar.svelte';
	import type { Editor } from '@tiptap/core';
	import type { Readable } from 'svelte/store';
	import type { AuthorizerState } from '@authorizerdev/authorizer-svelte/types';
	import FileEditor from './FileEditor.svelte';

	let state: AuthorizerState;

	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
		if (!state.user?.preferred_username) {
			goto('/signin');
		}
	});

	let editor: Editor;

	let activeFile: string;
</script>

<div class="container">
	<div class="sidebar">
		<Sidebar bind:activeFile></Sidebar>
	</div>
	<div class="editor">
		<Toolbar {editor} {activeFile} />
		<FileEditor bind:editor {activeFile}></FileEditor>
	</div>
</div>

<style>
	.container {
			display: flex;
			flex-direction: row;
	}

	.sidebar {
			z-index: 1;
			position: relative;
			gap: 0.75rem;
			display: flex;
			pointer-events: auto;

			width: 250px; 
			padding: 1.25rem;
			height: 100%;
			height: calc(100vh - 1.25rem - 1.25rem);
	}

	.editor {
			flex-grow: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: calc(100% - 250px);
			gap: 0.75rem;
			margin-top: 1.25rem;
	}
</style>
