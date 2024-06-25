<script lang="ts">
	import { currentFile } from '@/api/apiStore';
	import { File, Notebook } from 'lucide-svelte';
	import { draggingFile } from '../../sidebarStore';
	import type { Tables } from '@/supabase.types';
	import { getFileType } from '@/api/helpers';
	export let file: Tables<'document' | 'assignment' | 'assignment_answer'>;
	export let onClick = () => {
		currentFile.set(file);
	};
	export let active = false;

	$: if ($currentFile) {
		active = file.id == $currentFile.id;
	}

	window.onclick = (e) => {
		draggingFile.set(null);
	};
</script>

<div
	class="sidebar-elem br-1 clickable"
	draggable="true"
	role="button"
	tabindex="0"
	on:dragstart={(e) => draggingFile.set(file)}
	on:dragend={(e) => {
		draggingFile.set(null);
	}}
	class:active
>
	<a
		on:click={onClick}
		href="editor?id={file.id}&type={getFileType(file)}"
		class="reset"
		class:active
		draggable="false"
	>
		<div>
			{#if 'is_note' in file && file.is_note}
				<Notebook size={20} />
			{:else}
				<File size={20} />
			{/if}
		</div>
		<span class="name">{file.name}</span>
	</a>
</div>

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
