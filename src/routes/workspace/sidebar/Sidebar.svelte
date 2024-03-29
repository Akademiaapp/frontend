<script lang="ts">
	import SlimSidebar from './SlimSidebar.svelte';
	import WideSidebar from './WideSidebar.svelte';
	let isExpanded = true;
</script>

<nav class="sideBar">
	{#if isExpanded}
		<WideSidebar bind:isExpanded />
		<!-- content here -->
	{:else}
		<SlimSidebar bind:isExpanded />
	{/if}
</nav>

<style>
	.sideBar {
		pointer-events: auto;
		resize: horizontal;
		display: flex;
		gap: 0.75rem;
		flex-direction: column;
	}
</style>
