<script lang="ts">
	import Sidebar from './sidebar/Sidebar.svelte';
	// import ApiDown from '@/components/ApiDown.svelte';
	// updateAssignmentsAnswers();
	// updateAssignments();
</script>

<div class="cont">
	<div class={'sidebar floating-panel'}>
		<Sidebar></Sidebar>
	</div>

	<slot />

	<!-- <ApiDown></ApiDown> -->
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
