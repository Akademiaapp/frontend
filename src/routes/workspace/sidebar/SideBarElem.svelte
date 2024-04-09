<script lang="ts">
	type $$Props = import('svelte/elements').HTMLAttributes<HTMLDivElement> & {
		active?: boolean;
		clickable?: boolean;
	};

	export let active = false;

	export let clickable = true;
</script>

<div class:active class:clickable class="br-1 sidebar-elem" {...$$restProps}>
	<slot />
</div>

<style>
</style>
