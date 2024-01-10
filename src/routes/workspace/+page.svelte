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

<FileEditor bind:editor {activeFile}></FileEditor>
<div class="main">
	<Sidebar bind:activeFile></Sidebar>
	<Toolbar {editor} {activeFile} />
</div>

<style>
	.main {
		z-index: 1;
		position: fixed;
		gap: 0.75rem;
		display: flex;
		pointer-events: none;

		flex: 1rem;
		padding: 1.25rem;
		height: 100%;
		height: calc(100vh - 1.25rem - 1.25rem);
	}
</style>
