<script lang="ts">
	import FileViewer from './FileViewer.svelte';
	export let activeFile: string;
</script>

<nav class="sideBar">
	<div class="settings">Home</div>
	<FileViewer bind:activeFile></FileViewer>
</nav>

<style>
	.settings {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;
		background-color: var(--color-bg-1);

		border-radius: 8px;
		width: 100%;
		min-height: 5rem;
	}

	.sideBar {
		height: 100%;
		resize: horizontal;
		overflow: auto;
		min-width: 200px;
		max-width: 500px;
		align-items: stretch;
		display: flex;
		gap: 0.75rem;
		flex-direction: column;
		border-radius: 8px;
	}
</style>
