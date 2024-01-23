<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { goto } from '$app/navigation';
	import Sidebar from './Sidebar.svelte';
	import type { Readable } from 'svelte/store';
	import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
	import { updateFiles } from '@/api/fileHandler';
	import ApiHandler from '@/api';

	let state: AuthorizerState;

	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe(async (data: AuthorizerState) => {
		state = data;
		if (!state.user?.preferred_username) {
			goto('/signin');
		}
	});
	const api = new ApiHandler(<Readable<AuthorizerState>>getContext('authorizerContext'));
	setContext('api', api);
	updateFiles(api);
	

	export let activeFile: string = '';
	export let activeFilename: string = '';

	let sidebarVisible: boolean = true;

	$: console.log(sidebarVisible);
</script>

<div class="cont">
	<div class="sidebar floating-panel" class:hidden={!sidebarVisible}>
		<Sidebar bind:activeFile bind:sidebarVisible bind:activeFilename></Sidebar>
	</div>

	<slot />
</div>

<style lang="scss">
	.cont {
		display: flex;
		flex-direction: row;
		padding: var(--pad);
		gap: var(--gap);
		height: 100%;
		box-sizing: border-box;
	}

	.sidebar {
		float: left;
		gap: 0.75rem;
		display: flex;
		pointer-events: auto;

		width: 250px;

		transition: all 300ms cubic-bezier(0, 0.72, 0.21, 0.99);

		&.hidden {
			margin-left: calc(-250px - var(--pad));
		}
	}
</style>
