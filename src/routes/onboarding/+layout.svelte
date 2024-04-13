<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import {
		quadInOut
	} from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { canProceed, userType } from './onboardingStores.js';

	let currentProgress = 1;
	export let data;
	let urls: string[];
	$: {
		urls = [
			'',
			'1',
			'2',
			'3',
			'4',
			'5',
			'vaelg-skole',
			$userType === 'STUDENT' ? 'vaelg-klasse' : null,
			'done'
		].filter((it) => it !== null);
	}

	$: currentProgress = urls.indexOf(data.url.split('/').pop());

	export let movePage = (direction: number) =>
		function () {
			if (direction < 0) movingForward = false;
			else movingForward = true;

			currentProgress += direction;

			goto('/onboarding/' + urls[currentProgress]);

			// cheecky hack to make the button from the fist page transition forward.
			setTimeout(() => {
				movingForward = true;
			}, 100);
		};

	let movingForward = true;

	const anim = {
		duration: 300,
		easing: quadInOut,
		opacity: 1
	};

	let hello = 'hello';

	let hasBeen = [];
</script>

<div class="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center">
	<div class="cont br-3 min-h-[34rem] border">
		<div class="relative flex-1">
			{#key data.url}
				<!-- {#if data.url.endsWith('signup')} -->
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
				<!-- {:else}
					<div class="content">
						<slot />
					</div>
				{/if} -->
			{/key}
		</div>
		{#if data.url !== '/onboarding/' && data.url !== '/onboarding' && data.url !== '/onboarding/login' && data.url !== '/onboarding/signup'}
			<div class="mb-5 flex items-center justify-between gap-3" in:fade={{ delay: 400 }}>
				<Button variant="outline" size="icon" on:click={movePage(-1)}
					><ChevronLeft></ChevronLeft></Button
				>
				<!-- <div></div> -->
				<div class="progress flex h-1.5 max-w-32 flex-1 items-stretch justify-between">
					{#each urls as url, index (url)}
						<div
							class="item"
							class:completed={+currentProgress + 1 > index}
							transition:scale
							id={url}
						></div>
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
	}

	.progress div {
		// flex: 1;
		aspect-ratio: 1;
		align-self: stretch;
		background-color: var(--color-text-2-t);
		border-radius: 100rem;

		transition: background-color 0.2s;

		&.completed {
			background-color: var(--color-accent);
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
		width: 100%;
		padding-bottom: 1rem;

		position: absolute;
	}
</style>
