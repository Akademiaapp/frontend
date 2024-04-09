<script lang="ts">
	import DraggableElem from './../../DraggableElem.svelte';
	import { currentFile } from '@/api/apiStore';
	import { FileInfo, DocumentInfo, Folder } from '@/api/fileClasses';
	import { capLength } from '$lib/utils/stringUtils';
	import SideBarElem from '../../SideBarElem.svelte';
	import { File, Notebook } from 'lucide-svelte';
	import { draggingElem } from '../../sidebarStore';
	import { folders } from '../../sidebarStore';
	export let file: FileInfo | DocumentInfo;
	export let onClick = () => {
		currentFile.set(file);
	};
	export let active = false;

	$: if ($currentFile instanceof FileInfo) {
		active = file.id == $currentFile.id;
	}

	function findAndRemoveFile(files: FileInfo[], folders: Folder[], fileTobeRemoved: FileInfo) {
		const index = files.findIndex((f) => f.id == file.id);
		if (index != -1) {
			files.splice(index, 1);
		}
		for (const folder of folders) {
			findAndRemoveFile(folder.files, [], fileTobeRemoved);
		}
		return files;
	}
</script>

<DraggableElem
	{active}
	ondrop={() => {
		if ($draggingElem instanceof Folder) {
			console.log('is folder');
			folders.update((prev) => {
				findAndRemoveFile([], prev, file);
				$draggingElem.files = [...$draggingElem.files, file];
				return prev;
			});
		}
	}}
>
	<a
		on:click={onClick}
		href="editor?id={file.id}&type={file instanceof DocumentInfo
			? file.isNote
				? 'notes'
				: 'documents'
			: file.fileType}"
		class="reset"
		class:active
		draggable="false"
	>
		<div>
			{#if file instanceof DocumentInfo && file.isNote}
				<Notebook size={20} />
			{:else}
				<File size={20} />
			{/if}
		</div>
		<span class="name">{file.name}</span>
	</a>
</DraggableElem>

<style lang="scss">
	.name {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.active .name {
		color: var(--color-text-0);
	}

	a {
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;

		div {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
