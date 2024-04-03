<script lang="ts">
	import FileList from './FileList.svelte';
	import { slide } from 'svelte/transition';
	import type { FileInfo, Folder } from '@/api/apiStore';
	import SideBarElem from '../../SideBarElem.svelte';
	import { ArrowLeft, ChevronRight } from 'lucide-svelte';
	import File from './File.svelte';
	import EmojiSelector from '../../../../emoji/EmojiSelector.svelte';

	export let open: boolean = false;

	export let folder: Folder;

	export let active = false;
</script>

<div>
	<SideBarElem {active}>
		<div class="cont flex">
			<button
				on:click={() => {
					open = !open;
				}}
				class="openbox origin-center"
				class:rotate-90={open}
			>
				<ChevronRight size={20}></ChevronRight>
			</button>
			{#if folder.emoji}
				<EmojiSelector value={folder.emoji} />
				<!-- content here -->
			{/if}
			<span class="name">{folder.name}</span>
		</div>
	</SideBarElem>
	<div class="w-full pl-5">
		{#if open}
			<!-- content here -->
			<div class="sub-files flex flex-col" transition:slide>
				<FileList folders={folder.subFolders} files={folder.files}></FileList>
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

		div {
			display: flex;
			align-items: stretch;
			justify-content: center;
		}
	}
</style>
