<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import Toolbar from './Toolbar.svelte';
	import Tiptap from './Tiptap.svelte';
	import Sidebar from './Sidebar.svelte';
	import type { Editor } from '@tiptap/core';
	import type { Readable } from 'svelte/store';
	import type { AuthorizerState } from '@authorizerdev/authorizer-svelte/types';

	let state: AuthorizerState;

	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
		if (!state.user?.preferred_username) {
			goto('/login');
		}
	});

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
		gap: 0.75rem;
		display: flex;
		background-color: var(--color-bg-0);
		flex: 1rem;
		padding: 0.75rem;
		height: 100%;
		height: calc(100vh - 0.75rem - 0.75rem);
	}

	.editor {
		flex: 1;
		background-color: var(--color-bg-1);
		display: flex;
		flex-direction: column;
	}
</style>
