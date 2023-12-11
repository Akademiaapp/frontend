<script>
	import Layout from '../+layout.svelte';
	import { isThemeChecked } from '../store';
	import Sidebar from './Sidebar.svelte';
	export const prerender = false;

	export let checked = false;

	$: isThemeChecked.set(checked);
</script>

<div class="main">
	<Sidebar></Sidebar>
	<div class="editor">
		<input type="checkbox" bind:checked />
	</div>
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
