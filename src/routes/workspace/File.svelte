<script>
	import { capLength } from '$lib/utils/stringUtils';
	import { goto } from '$app/navigation';
	import SideBarElem from './SideBarElem.svelte';
	export let name = 'fileName';
	export let id = "";
	export let onClick = () => {};
	export let active = false;
</script>

<SideBarElem {active}>
	<a on:click={onClick} href="editor?id={id}" class="reset" class:active>
		
		<span class="material-symbols-rounded icon-w-2"> description </span>
		<span class="name">{name}</span>
	</a>
</SideBarElem>

<style lang="scss">
	.name {
		text-overflow: ellipsis;
		overflow:hidden;
		white-space:nowrap;
	}
	.active .name {
		color: var(--color-text-0);
	}

	a {
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}


</style>
