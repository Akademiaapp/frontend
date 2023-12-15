<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import QuickAction from './QuickAction.svelte';
	import fadeScale from '$lib/transitions/fade-scale';
	import { tick } from 'svelte';
	import { expoOut, quadIn, quadInOut, quadOut, sineInOut, sineOut } from 'svelte/easing';

	let isSeaching = false;

	let searchInput: HTMLElement;

	async function openSearch() {
		isSeaching = true;
		await tick();
		searchInput.focus();
		console.log(searchInput.innerHTML);
	}
</script>

<QuickAction icon="search.svg" action={openSearch}></QuickAction>

{#if isSeaching}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="background"
		on:click|self={() => (isSeaching = false)}
		transition:fade={{ duration: 200, easing: sineInOut }}
	>
		<div class="search br-3" transition:fadeScale={{ duration: 100, easing: expoOut }}>
			<div class="search-bar">
				<img src={'icons/search.svg'} alt="" />
				<input type="text" placeholder="Search" bind:this={searchInput} />
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.background {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: var(--color-overlay-6);
		backdrop-filter: blur(2px);
		z-index: 10;
		display: flex;
		/* align-items: center; */
		align-items: self-start;
		justify-content: center;
	}

	.search {
		margin: 5rem;
		margin-top: 20vh;
		background-color: var(--color-bg-1);
		box-shadow: 0.1 0.1rem 1rem rgba(0, 0, 0, 0.1);
		max-width: 35rem;
		width: 100%;
	}

	.search-bar {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 1.2rem;

		img {
			height: 2rem;
			filter: invert(var(--invert-0));
		}
	}

	input {
		padding: 0;
		font-size: 1.5rem;
		background-color: transparent;
		border: none;
		width: 100%;

		&:focus {
			outline: none;
		}

		&::placeholder {
			color: var(--color-text-2);
		}
	}
</style>
