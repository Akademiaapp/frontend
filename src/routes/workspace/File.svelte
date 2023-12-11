<script>
	export let name = 'fileName';
	export let onClick = () => {};
	export let active = false;
</script>

<div on:click={onClick()} class:active>
	{name}
</div>

<style>
	.active {
		color: black;
	}
</style>
