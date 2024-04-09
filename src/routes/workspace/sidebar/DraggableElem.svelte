<script lang="ts">
	import { isDragging } from './sidebarStore';

	type $$Props = import('svelte/elements').HTMLAttributes<HTMLDivElement> & {
		active?: boolean;
		clickable?: boolean;
		ondrop?: () => void;
	};

	export let active = false;

	export let clickable = true;

	$: console.log($isDragging);

	export let ondrop = () => {};
</script>

<div
	class:active
	class:clickable
	class="br-1"
	{...$$restProps}
	draggable="true"
	role="button"
	tabindex="0"
	on:dragstart={(e) => isDragging.set(true)}
	on:dragend={(e) => {
		isDragging.set(false);
		console.log('dropped');
		ondrop();
	}}
>
	<slot />
</div>

<style>
	div {
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		font-weight: 500;
	}

	.clickable:hover {
		background-color: color-mix(in srgb, var(--color-text-0) 10%, transparent);
	}

	.active {
		background-color: color-mix(in srgb, var(--color-text-0) 5%, transparent);
	}
</style>
