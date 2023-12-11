<script>
	import SideBarElem from './SideBarElem.svelte';
	export let name = 'fileName';
	export let onClick = () => {};
	export let active = false;
</script>

<SideBarElem {active}>
	<div on:click={onClick()} class:active>
		{name}
	</div>
</SideBarElem>

<style>
	.active {
		color: black;
	}

	div {
		cursor: pointer;
	}
</style>
