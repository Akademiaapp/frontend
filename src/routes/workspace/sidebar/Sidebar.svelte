<script lang="ts">
	import { clamp } from '@/utils/mathUtils';
	import SlimSidebar from './SlimSidebar.svelte';
	import WideSidebar from './WideSidebar.svelte';
	let isExpanded = true;

	function handleMouseMove(event) {
		console.log(event);
		const width = event.clientX - sidebar.getBoundingClientRect().left;
		console.log(width, slimSidebarWidth);
		if (width > 150) {
			w = clamp(width, minWidth, maxWidth) + 'px';
			isExpanded = true;
		} else {
			isExpanded = false;
		}
	}

	$: if (isExpanded) {
		if (w == slimSidebarWidth + 'px') {
			anim();
			w = '300px';
		}
	} else {
		anim();
		w = slimSidebarWidth + 'px';
	}

	let w = '300px';

	function anim() {
		if (!sidebar) return;
		sidebar.style.transition = 'width 0.3s';
		setTimeout(() => {
			sidebar.style.transition = '';
		}, 300);
	}

	const maxWidth = 400;
	const minWidth = 190;

	let slimSidebarWidth = 54.4;
	function handleMouseDown(event) {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', () => {
			window.removeEventListener('mousemove', handleMouseMove);
		});
	}

	let sidebar;
</script>

<nav class="sideBar relative" bind:this={sidebar} style:width={w}>
	{#if isExpanded}
		<WideSidebar bind:isExpanded />
	{:else}
		<SlimSidebar bind:isExpanded />
	{/if}
	<button
		class="absolute left-full h-full w-1 cursor-e-resize bg-transparent"
		on:mousedown={handleMouseDown}
	></button>
</nav>

<style>
	.sideBar {
		pointer-events: auto;
		resize: block;
		display: flex;
		gap: 0.75rem;
		flex-direction: column;
	}
</style>
