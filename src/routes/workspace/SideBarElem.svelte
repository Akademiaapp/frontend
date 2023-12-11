<script>
	export let active = false;
</script>

<div class:active>
	<slot />
</div>

<style>
	div {
		padding: 0.3rem 0.5rem;
		border-radius: 0.3rem;
	}

	div:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.active {
		background-color: rgba(0, 0, 0, 0.05);
	}
</style>
