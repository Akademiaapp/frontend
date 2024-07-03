<script lang="ts">
	import { isDragging } from './sidebarStore';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = import('svelte/elements').HTMLAttributes<HTMLDivElement> & {
		active?: boolean;
		clickable?: boolean;
		ondrop?: () => void;
	};

	export let active = false;

	export let clickable = true;
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
	on:dragstart={() => isDragging.set(true)}
	on:dragend={() => {
		isDragging.set(false);
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
