<script lang="ts">
	import SidebarAssignment from './sidebar/main/assignment/AssignmentTab.svelte';
	import Sidebar from './sidebar/Sidebar.svelte';
	import {
		updateDocuments,
		updateUserInfo,
		updateAssignmentsAnswers,
		updateAssignments
	} from '@/api/apiStore';
	import ApiDown from '@/components/ApiDown.svelte';

	updateDocuments();
	updateAssignmentsAnswers();
	updateAssignments();
	updateUserInfo();

	var urlParams = new URLSearchParams(window.location.search);
	var type = urlParams.get('type');

	let sidebarVisible: boolean = true;

	$: console.log(sidebarVisible);
</script>

<div class="cont">
	<div class={'sidebar floating-panel'}>
		<Sidebar></Sidebar>
	</div>

	<slot />

	<ApiDown></ApiDown>
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

		transition: all 300ms cubic-bezier(0, 0.72, 0.21, 0.99);
	}
</style>
