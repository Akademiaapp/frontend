<script lang="ts">
	import FileList from './FileList.svelte';
	import { slide } from 'svelte/transition';
	import { Folder } from '@/api/fileClasses';
	import { ChevronRight, Dot } from 'lucide-svelte';
	import EmojiSelector from '../../../../emoji/EmojiSelector.svelte';
	import { draggingFile, folders } from '../../sidebarStore';
	import type { Tables } from '@/supabase.types';

	export let open: boolean = false;

	export let folder: Folder;

	let blue = false;

	function findAndRemoveFile(
		folders: Folder[],
		fileTobeRemoved: Tables<'document' | 'assignment' | 'assignment_answer'>
	) {
		for (const folder of folders) {
			const index = folder.files.findIndex((f) => f.id == fileTobeRemoved.id);
			if (index != -1) {
				folder.files.splice(index, 1);
			}

			findAndRemoveFile(folder.subFolders, fileTobeRemoved);
		}
		return folders;
	}
</script>

<div>
	<div
		class={'sidebar-elem clickable br-1' + (blue ? ' bg-primary/20' : '')}
		on:dragenter={() => {
			if ($draggingFile) {
				blue = true;
			}
		}}
		on:dragover|preventDefault
		on:drop={() => {
			blue = false;
			if (folder.files.findIndex((f) => f.id == $draggingFile.id) != -1) return;
			folders.update((prev) => {
				findAndRemoveFile(prev, $draggingFile);
				folder.files = [...folder.files, $draggingFile];
				return prev;
			});
			draggingFile.set(null);
		}}
		on:dragleave={() => {
			blue = false;
		}}
		role="button"
		tabindex="0"
	>
		<div class="cont flex" class:pointer-events-none={$draggingFile}>
			<button
				disabled={folder.files.length == 0 && folder.subFolders.length == 0}
				on:click={() => {
					open = !open;
				}}
				class="openbox origin-center"
				class:rotate-90={open}
				tabindex="0"
			>
				{#if folder.files.length > 0 || folder.subFolders.length > 0}
					<ChevronRight size={20}></ChevronRight>
				{:else}
					<Dot size={20}></Dot>
				{/if}
			</button>
			{#if folder.emoji}
				<EmojiSelector value={folder.emoji} />
				<!-- content here -->
			{/if}
			<span class="name">{folder.name}</span>
		</div>
	</div>

	<div class="w-full pl-5">
		{#if true}
			<!-- content here -->
			<div class="sub-files flex flex-col" transition:slide>
				<FileList folders={folder.subFolders} filePath={folder.name}></FileList>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.openbox {
		height: 100%;
		transition: transform 0.3s;
	}

	.cont {
		font-size: 1.2rem;
		display: flex;
		align-items: center;

		button {
			color: var(--color-text-2);
			border-radius: 0.25rem;

			&:hover {
				color: var(--color-text-0);
			}
		}
	}
</style>
