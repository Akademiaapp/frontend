<script>
	export const prerender = false;
</script>

<div class="main">
	<nav class="sideBar"></nav>
	<div class="editor"></div>
</div>

<style>
	.main {
		height: 100%;
		flex: 1;
		width: 100%;
		display: flex;
	}

	.sideBar {
		background-color: var(--color-bg-1);
		width: 300px;
		resize: horizontal;
		overflow: auto;
		min-width: 200px;
		max-width: 500px;
	}

	.editor {
		flex: 1;
		background-color: var(--color-bg-0);
	}
</style>
