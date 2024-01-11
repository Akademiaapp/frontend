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
		height: 100%;
		z-index: 1;
		float: left;
		position: sticky;
		top: 0;
		gap: 0.75rem;
		display: flex;
		pointer-events: auto;

		width: 250px;
		padding: var(--pad);
		height: 100%;
		height: calc(100vh - var(--pad) - var(--pad));
	}

	.editor {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: calc(100% - 250px);
		gap: 0.75rem;
		margin-top: var(--pad);
	}
</style>
