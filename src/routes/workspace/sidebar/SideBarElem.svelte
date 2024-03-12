<script>
	export let active = false;

	export let clickable = true;
</script>

<div class:active class:clickable class="br-1">
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
