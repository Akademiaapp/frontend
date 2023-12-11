<script>
	import FileViewer from './FileViewer.svelte';
</script>

<nav class="sideBar">
	<FileViewer></FileViewer>
</nav>

<style>
	.sideBar {
		background-color: var(--color-bg-1);
		width: 300px;
		resize: horizontal;
		overflow: auto;
		min-width: 200px;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		padding: 0.4rem;
		padding-top: 1rem;
	}
</style>
