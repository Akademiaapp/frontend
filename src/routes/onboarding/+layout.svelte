<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import swipe from '$lib/transitions/swipe.js';
	import { fly, fade } from 'svelte/transition';
	import { page } from '$app/stores'; // <-- new
	import {
		cubicIn,
		cubicInOut,
		cubicOut,
		expoIn,
		expoInOut,
		expoOut,
		quadIn,
		quadInOut,
		quadOut,
		sineIn,
		sineOut
	} from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { canProceed } from './proccedStore.js';

	let currentProgress = '0';
	$: currentProgress = data.url.split('/').pop();
	export let data;

	export let movePage = (direction: number) =>
		function () {
			if (direction < 0) movingForward = false;
			else movingForward = true;

			if (movingForward && !$canProceed) {
				return;
			}

			const newPage = +currentProgress + direction;
			console.log(newPage, currentProgress, direction, +currentProgress + direction);
			console.log('/onboarding/' + (newPage === 0 ? '' : newPage));

			goto('/onboarding/' + (newPage === 0 ? '' : newPage));

			// checky hack to make the button from the fist page transition forward.
			setTimeout(() => {
				movingForward = true;
			}, 100);
		};

	let movingForward = true;

	const anim = {
		duration: 400,
		easing: quadInOut,
		opacity: 1
	};
</script>

<div class="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center">
	<div class="cont br-3 border">
		<div class="relative flex-1 overflow-y-clip">
			{#key data.url}
				<div
					in:fly={{ ...anim, x: movingForward ? '120%' : '-120%' }}
					out:fly={{
						...anim,
						x: movingForward ? '-120%' : '120%'
					}}
					class="content"
				>
					<slot />
				</div>
			{/key}
		</div>
		{#if data.url !== '/onboarding/' && data.url !== '/onboarding'}
			<div class="mb-5 flex items-center justify-between" in:fade={{ delay: 400 }}>
				<Button variant="outline" size="icon" on:click={movePage(-1)}
					><ChevronLeft></ChevronLeft></Button
				>
				<!-- <div></div> -->
				<div class="progress flex h-1.5 w-[50%] items-center justify-center gap-3">
					{#each Array(5) as _, index}
						<div class="item" class:completed={+currentProgress > index}></div>
					{/each}
				</div>

				<Button
					variant="outline"
					disabled={!$canProceed}
					class="self-center"
					size="icon"
					on:click={movePage(1)}><ChevronRight></ChevronRight></Button
				>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.cont {
		height: 100%;
		/* height: 100%; */
		/* height: 100%; */
		padding: 3rem;
		padding-bottom: 1rem;
		display: flex;
		flex-direction: column;
		margin: 4rem 1rem;
		max-width: 30rem;
		width: 100%;
		height: 100%;
		max-height: min(35rem, 100% - 4rem);
		background-color: var(--color-bg-1);

		overflow: hidden;

		div {
			// max-height: calc(100% - 1rem);
		}
	}

	.progress div {
		// flex: 1;
		aspect-ratio: 1;
		align-self: stretch;
		background-color: var(--color-text-2-t);
		border-radius: 100rem;

		transition: background-color 0.2s;

		&.completed {
			background-color: var(--color-accent-1);
		}
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		// align-items: center;
		gap: 0.25rem;

		height: 20rem;

		height: 100%;
		widows: 100%;

		position: absolute;

		// overflow: auto;
	}

	h1 {
		margin: 0;
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
