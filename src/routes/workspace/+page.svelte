<script>
	import Sidebar from './Sidebar.svelte';
	export const prerender = false;
</script>

<div class="main">
	<Sidebar></Sidebar>
	<div class="editor"></div>
</div>

<style>
	.main {
		height: 100%;
		flex: 1;
		width: 100%;
		display: flex;
	}

	.editor {
		flex: 1;
		background-color: var(--color-bg-0);
	}
</style>
