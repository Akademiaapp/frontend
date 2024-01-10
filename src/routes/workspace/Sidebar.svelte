<script lang="ts">
	import QuickBar from './quickActions/QuickBar.svelte';
	import FileViewer from './FileViewer.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
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
		pointer-events: auto;
		resize: horizontal;
		overflow: auto;
		width: 18rem;
		min-width: 10rem;
		max-width: 16rem;
		display: flex;
		gap: 0.75rem;
		flex-direction: column;
	}
</style>
