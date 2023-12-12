<script lang="ts">
	import Tiptap from './Tiptap.svelte';
	import Layout from '../+layout.svelte';
	import { isThemeChecked } from '../store';
	import Sidebar from './Sidebar.svelte';

	export let checked = false;
	let editorAction: () => void;

	// I have no clue why we are setting it to false

	let activeFile: string;

	$: isThemeChecked.set(checked);
	
</script>

<div class="main">
	<Sidebar bind:activeFile ></Sidebar>
	<div class="editor">
		dark theme:
		<input type="checkbox" bind:checked />
		<Tiptap activeFile={activeFile} bind:resize={editorAction}></Tiptap>
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
		padding: 1rem 4rem;
		flex: 1;
		background-color: var(--color-bg-0);

		display: flex;
		flex-direction: column;
	}
</style>
