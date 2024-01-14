<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import Sidebar from './Sidebar.svelte';
	import type { Editor } from '@tiptap/core';
	import type { Readable } from 'svelte/store';
	import type { AuthorizerState } from '@authorizerdev/authorizer-svelte/types';
	import FileEditor from './editor/FileEditor.svelte';

	let state: AuthorizerState;

	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
		if (!state.user?.preferred_username) {
			goto('/signin');
		}
	});

	export let activeFile: string;
	export let activeFilename: string;

	let sidebarVisible: boolean = true;

	$: console.log(sidebarVisible);
</script>

<div class="container">
	<div class="sidebar" class:hidden={!sidebarVisible}>
		<Sidebar bind:activeFile bind:sidebarVisible bind:activeFilename></Sidebar>
	</div>

	<slot />
</div>

<style lang="scss">
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

		transition: all 200ms cubic-bezier(0, 0, 0.24, 1.11);

		&.hidden {
			margin-left: calc(-250px - var(--pad));
		}
	}
</style>
