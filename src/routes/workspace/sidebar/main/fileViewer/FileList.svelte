<script lang="ts">
	import type { ClientFile, Folder } from '@/api/apiStore';
	import File from './File.svelte';
	import FolderItem from './FolderItem.svelte';

	export let folders: Folder[] = [];
	export let files: ClientFile[] = [];

	console.log(files);
</script>

<div class="files br-2">
	{#each folders as folder}
		<FolderItem {folder}></FolderItem>
	{/each}
	{#each files as file}
		<div>
			<File {file}></File>
		</div>
		<!-- content here -->
	{/each}
</div>

<style>
	.files {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 1.05rem;
	}
</style>
