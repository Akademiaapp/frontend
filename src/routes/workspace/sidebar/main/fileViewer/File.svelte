<script lang="ts">
	import { DocumentInfo, FileInfo, currentFile } from '@/api/apiStore';
	import { capLength } from '$lib/utils/stringUtils';
	import SideBarElem from '../../SideBarElem.svelte';
	import { File, Notebook } from 'lucide-svelte';
	export let file: FileInfo | DocumentInfo;
	export let onClick = () => {
		currentFile.set(file);
	};
	export let active = false;

	$: if ($currentFile instanceof FileInfo) {
		active = file.id == $currentFile.id;
	}
</script>

<SideBarElem {active}>
	<a
		on:click={onClick}
		href="editor?id={file.id}&type={file instanceof DocumentInfo
			? file.isNote
				? 'notes'
				: 'documents'
			: file.fileType}"
		class="reset"
		class:active
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
</SideBarElem>

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
