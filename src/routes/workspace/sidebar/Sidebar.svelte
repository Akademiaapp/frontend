<script lang="ts">
	import { sidebarWidth } from './../../store';
	import { clamp } from '@/utils/mathUtils';
	import SlimSidebar from './SlimSidebar.svelte';
	import WideSidebar from './WideSidebar.svelte';
	import { currentTab } from './sidebarStore';
	let isExpanded = true;

	function handleMouseMove(event) {
		const width = event.clientX - sidebar.getBoundingClientRect().left;
		if (width > 150) {
			sidebarWidth.set(clamp(width, minWidth, maxWidth) + 'px');
			isExpanded = true;
		} else {
			isExpanded = false;
		}
	}

	$: if (isExpanded) {
		if ($sidebarWidth == slimSidebarWidth + 'px') {
			anim();
			$sidebarWidth = '300px';
		}
	} else {
		anim();
		sidebarWidth.set(slimSidebarWidth + 'px');
	}

	let animTimout;

	function anim() {
		if (!sidebar) return;
		sidebar.style.transition = 'width 0.3s';
		if (animTimout) {
			clearTimeout(animTimout); // clear previous timeout
		}
		animTimout = setTimeout(() => {
			sidebar.style.transition = '';
		}, 300);
	}

	let maxWidth = 600;
	let minWidth = 275;

	let slimSidebarWidth = 54.4;
	function handleMouseDown() {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', () => {
			window.removeEventListener('mousemove', handleMouseMove);
		});
	}

	const widths = { files: '300px', assignment: '400px', chat: '400px' };

	let sidebar;

	$: maxWidth = $currentTab == 'assignment' ? 600 : 550;
	$: minWidth = $currentTab == 'assignment' ? 350 : 275;
	$: {
		anim();
		$sidebarWidth =
			$currentTab == 'assignment' ? '450px' : $currentTab == 'chat' ? '400px' : '300px';
	}
</script>

<nav class="sideBar relative" bind:this={sidebar} style:width={$sidebarWidth}>
	{#if isExpanded}
		<WideSidebar bind:currentTab={$currentTab} bind:isExpanded />
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
