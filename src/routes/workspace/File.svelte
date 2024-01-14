<script>
	import { goto } from '$app/navigation';
	import SideBarElem from './SideBarElem.svelte';
	export let name = 'fileName';
	export let onClick = () => {};
	export let active = false;
</script>

<SideBarElem {active}>
	<div on:click={() => {goto("editor"); onClick(); }} class:active>
		<span class="material-symbols-rounded icon-w-2"> description </span>
		<span class="name">{name}</span>
	</div>
</SideBarElem>

<style>
	.active .name {
		color: var(--color-text-0);
	}

	div {
		font-size: 1.2rem;
		text-align: center;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
