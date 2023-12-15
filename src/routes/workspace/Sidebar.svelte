<script lang="ts">
	import QuickBar from './quickActions/QuickBar.svelte';
	import FileViewer from './FileViewer.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import QuickAction from './quickActions/QuickAction.svelte';
	export let activeFile: string;
</script>

<nav class="sideBar">
	<div class="settings br-2">
		<UserAvatar name />
		<QuickBar />
	</div>
	<FileViewer bind:activeFile></FileViewer>
</nav>

<style>
	.settings {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1rem;
		flex-direction: column;
		background-color: var(--color-bg-1);
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
	}
</style>
