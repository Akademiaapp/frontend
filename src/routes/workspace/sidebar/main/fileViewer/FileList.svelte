<script lang="ts">
	import type { Folder } from '@/api/apiStore';
	import File from './File.svelte';
	import FolderItem from './FolderItem.svelte';
	import { documents } from '@/supabase/supabaseClient';

	export let folders: Folder[] = [];
	export let filePath: string;

	let files;

	documents.keyedStore.subscribe((value) => {
		files = value[filePath] ?? [];
	});
	console.log('path', filePath, 'files:', files);
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
