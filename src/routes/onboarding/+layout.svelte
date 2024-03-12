<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import swipe from '$lib/transitions/swipe.js';
	import { fly, fade } from 'svelte/transition';
	import { page } from '$app/stores'; // <-- new
	import { cubicIn } from 'svelte/easing';
	import { goto } from '$app/navigation';

	let currentProgress = 0;
	$: currentProgress = data.url.split('/').pop();
	export let data;

	let movePage = (direction: number) =>
		function () {
			const newPage = +currentProgress + direction;
			console.log(newPage, currentProgress, direction, +currentProgress + direction);
			console.log('/onboarding/' + (newPage === 0 ? '' : newPage));

			goto('/onboarding/' + (newPage === 0 ? '' : newPage));
		};
</script>

<div class="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center">
	<div class="cont br-3 border">
		<div class="flex-1">
			{#key data.url}
				<div
					in:fly={{ duration: 400, x: '100%', delay: 400 }}
					out:fly={{ duration: 400, x: '-100%', easing: cubicIn }}
					class="content"
				>
					<slot />
				</div>
			{/key}
		</div>

		{#if data.url !== '/onboarding/' && data.url !== '/onboarding'}
			<div class="flex items-center justify-between p-5" in:fade={{ delay: 400 }}>
				<Button variant="outline" size="icon" on:click={movePage(-1)}
					><ChevronLeft></ChevronLeft></Button
				>
				<!-- <div></div> -->
				<div class="progress flex h-1 w-[50%] items-center gap-2">
					{#each Array(5) as _, index}
						<div class="item" class:completed={currentProgress > index}></div>
					{/each}
				</div>

				<Button
					variant="outline"
					size="icon"
					on:click={() => {
						goto('/onboarding/' + (+currentProgress + 1));
					}}><ChevronRight></ChevronRight></Button
				>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.cont {
		/* height: 100%; */
		/* height: 100%; */
		display: flex;
		flex-direction: column;
		margin: 4rem 1rem;
		max-width: 30rem;
		width: 100%;
		height: 100%;
		max-height: min(35rem, 100% - 4rem);
		background-color: var(--color-bg-1);

		overflow: hidden;
	}

	.progress div {
		flex: 1;
		align-self: stretch;
		background-color: var(--color-text-2-t);
		border-radius: 100rem;

		transition: background-color 0.2s;

		&.completed {
			background-color: var(--color-accent-1);
		}
	}

	.content {
		padding: 3rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;

		overflow: auto;
		height: 100%;
	}

	h2 {
		font-weight: normal;
		margin: 0;
	}

	img {
		margin-left: -1rem;
	}

	a {
		color: var(--color-text-2);
		font-size: 0.75rem;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
</style>
