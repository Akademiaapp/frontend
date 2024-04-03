<script lang="ts">
	import { sidebarWidth } from './../../store';
	import { clamp } from '@/utils/mathUtils';
	import SlimSidebar from './SlimSidebar.svelte';
	import WideSidebar from './WideSidebar.svelte';
	let isExpanded = true;

	function handleMouseMove(event) {
		console.log(event);
		const width = event.clientX - sidebar.getBoundingClientRect().left;
		console.log(width, slimSidebarWidth);
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

	function anim() {
		if (!sidebar) return;
		sidebar.style.transition = 'width 0.3s';
		setTimeout(() => {
			sidebar.style.transition = '';
		}, 300);
	}

	let maxWidth = 400;
	let minWidth = 275;

	let slimSidebarWidth = 54.4;
	function handleMouseDown(event) {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', () => {
			window.removeEventListener('mousemove', handleMouseMove);
		});
	}

	let sidebar;
	let currentTab;

	$: maxWidth = currentTab == 'assignment' ? 600 : 400;
	$: minWidth = currentTab == 'assignment' ? 400 : 275;
	$: if (currentTab == 'assignment') {
		$sidebarWidth = '550px';
	} else {
		$sidebarWidth = maxWidth + 'px';
	}
</script>

<nav class="sideBar relative" bind:this={sidebar} style:width={$sidebarWidth}>
	{#if isExpanded}
		<WideSidebar bind:currentTab bind:isExpanded />
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
