<script lang="ts">
	import FileList from './FileList.svelte';
	import { slide } from 'svelte/transition';
	import { Folder } from '@/api/fileClasses';
	import SideBarElem from '../../SideBarElem.svelte';
	import { ArrowLeft, ChevronRight } from 'lucide-svelte';
	import File from './File.svelte';
	import EmojiSelector from '../../../../emoji/EmojiSelector.svelte';
	import { draggingElem, isDragging } from '../../sidebarStore';

	export let open: boolean = false;

	export let folder: Folder;

	export let active = false;

	let blue = false;

	$: console.log(blue);
</script>

<div>
	<div
		class={'sidebar-elem clickable br-1' + (blue && ' !bg-primary/20')}
		on:dragenter={() => {
			if ($isDragging) {
				blue = true;
				draggingElem.set(folder);
			}
		}}
		on:dragleave={() => {
			blue = false;
			console.log('hddhd');
			setTimeout(() => {
				draggingElem.set(null);
			}, 10);
		}}
		role="button"
		tabindex="0"
	>
		<div class="cont flex" class:pointer-events-none={$isDragging}>
			<button
				on:click={() => {
					open = !open;
				}}
				class="openbox origin-center"
				class:rotate-90={open}
				tabindex="0"
			>
				<ChevronRight size={20}></ChevronRight>
			</button>
			{#if folder.emoji}
				<EmojiSelector value={folder.emoji} />
				<!-- content here -->
			{/if}
			<span class="name">{folder.name}</span>
		</div>
	</div>

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
	}
</style>
