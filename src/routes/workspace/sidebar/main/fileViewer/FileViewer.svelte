<script lang="ts">
	import { folders } from './../../sidebarStore';

	import SideBarElem from '../../SideBarElem.svelte';
	import { newDocument } from '@/api/helpers';
	import { tick } from 'svelte';
	import Category from './Category.svelte';
	import { documents } from '@/supabase/supabaseClient';

	$: files = $documents;

	let atBottom = true;

	function onscroll(event) {
		if (!event.target) return;
		const { scrollHeight, scrollTop, clientHeight } = event.target;
		atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;
	}

	let filesElem;

	documents.subscribe(async (value) => {
		await tick();
		onscroll({ target: filesElem });
	});
</script>

<div class="cont">
	<div class="files sidebar-scroll p-1" on:scroll={onscroll} bind:this={filesElem}>
		<Category name="Fag" folders={$folders[0].subFolders}></Category>
		<Category name="Andet" files={$folders[1].files}></Category>
	</div>
	<div class="splitter"></div>
	<div class="z-10 p-1 shadow-black transition-shadow duration-500" class:shadow-2xl={!atBottom}>
		<SideBarElem active={false}>
			<button on:click={() => newDocument('Uden titel', false, true)} class="reset no-bg size-full">
				<span class="material-symbols-rounded icon-w-2">add</span>
				<span>Ny fil</span>
			</button>
		</SideBarElem>
	</div>
</div>

<style lang="scss">
	.splitter {
		flex: 1;
	}
	.cont {
		display: flex;
		flex-direction: column;

		font-size: 1.05rem;
		color: var(--color-text-2);
		background-color: var(--color-bg-1);

		// max-height: calc(100% - 4rem);

		overflow-y: hidden;
	}

	.files {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 1.05rem;
		overflow-y: auto;
	}
	:global(.sidebar-scroll) {
		&::-webkit-scrollbar {
			height: 0;
			width: 10px;
			background-color: hsl(0, 0%, 0%, 0.04);
			background-color: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background-color: hsl(0, 0%, 0%, 0.1);
		}
	}

	button {
		display: flex;
		gap: 0.25rem;
		justify-self: end;
	}
</style>
