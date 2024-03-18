<script>
	export let active = false;

	export let clickable = false;
</script>

<div class:active class="br-1">
	<slot />
</div>

<style>
	div {
		padding: 0.25rem 0.5rem;
		cursor: pointer;
		font-weight: 500;
	}

	div:hover {
		background-color: color-mix(in srgb, var(--color-text-0) 10%, transparent);
	}

	.active {
		background-color: color-mix(in srgb, var(--color-text-0) 5%, transparent);
	}
</style>
