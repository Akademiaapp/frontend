<script lang="ts">
	export let onClick;
	export let title = '';
	export let selected = false;
	let clazz = null;
	export { clazz as class };
</script>

<button
	class={(clazz ? clazz : 'flex') + ' toolbar-button'}
	{title}
	on:click={onClick}
	class:active={selected}
>
	<slot />
</button>

<style lang="scss">
	.toolbar-button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		padding: 0.35rem;
		border-radius: 0.2rem;
		transition: background-color 0.2s;
		color: var(--text-color);
	}

	.toolbar-button:hover {
		background-color: var(--color-overlay-0);
	}

	.toolbar-button.active {
		background-color: var(--color-overlay-1);
	}
</style>
