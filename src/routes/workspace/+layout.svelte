<script lang="ts">
	import SidebarAssignment from './sidebar/SidebarAssignment.svelte';
	import { setContext } from 'svelte';
	import Sidebar from './sidebar/Sidebar.svelte';
	import { updateDocuments, updateUserInfo, updateAssignments } from '@/api/apiStore';
	import ApiHandler from '@/api';
	import ApiDown from '@/components/ApiDown.svelte';
	import { userInfo } from '../../authStore';

	const api = new ApiHandler($userInfo);
	setContext('api', api);
	updateDocuments();
	updateAssignments();
	updateUserInfo($userInfo);

	var urlParams = new URLSearchParams(window.location.search);
	var type = urlParams.get('type');

	let sidebarVisible: boolean = true;

	$: console.log(sidebarVisible);
</script>

<div class="cont">
	<div class={'sidebar floating-panel'} class:wide={type == 'assignment'}>
		{#if type === 'assignment'}
			<SidebarAssignment />
		{:else}
			<Sidebar></Sidebar>
		{/if}
	</div>

	<slot />

	<ApiDown></ApiDown>
</div>

<style lang="scss">
	.wide {
		width: 30rem !important;
	}
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

		transition: all 300ms cubic-bezier(0, 0.72, 0.21, 0.99);

		&.hidden {
			margin-left: calc(-250px - var(--pad));
		}
	}
</style>
