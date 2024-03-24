<script lang="ts">
	import { Progress } from '@/components/ui/progress';
	import Button from '@/components/ui/button/button.svelte';
	import { Pause, Play } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import Slider from '@/components/ui/slider/slider.svelte';

	export let visible: boolean;

	let isStarted = false;
	let remainingTime = 30 * 60;

	$: if (remainingTime <= 0) {
		let ding = new Audio(
			'https://gist.githubusercontent.com/cferdinandi/9842dbe5f7286f0ed1edbb7203453a61/raw/6737423b76a764e3ec609a432a61c34dd79ff406/ding.mp3'
		);
		ding.play();
		toast.success('Tiden er oppe!', { description: 'Timeren nåede 0.' });
		remainingTime = 30 * 60;
		isStarted = false;
	}

	setInterval(() => {
		if (isStarted) {
			remainingTime -= 1;
		}
	}, 1);

	let value = [remainingTime];
	$: remainingTime = value[0];
</script>

{#if visible}
	<div class="cont br-2 float-panel timer">
		<div class="flex flex-row justify-between">
			<div class="mr-1">
				<h2>Timer</h2>
				<p>
					{(remainingTime / 60) | 0}m {remainingTime % 60}s tilbage
				</p>
			</div>
			<Button class="h-10 w-10 rounded-full p-0" on:click={() => (isStarted = !isStarted)}>
				{#if isStarted}
					<Pause />
				{:else}
					<Play />
				{/if}
			</Button>
		</div>
		{#if isStarted}
			<Progress value={Math.round((remainingTime / value[0]) * 1000) / 10} />
		{:else}
			<Slider bind:value min={0} max={30 * 60} step={60} />
		{/if}
	</div>
{/if}

<style lang="scss">
	.timer {
		height: 7rem;
	}

	.timer h2 {
		margin-bottom: 0;
		font-size: large;
	}

	.timer p {
		opacity: 0.5;
		font-size: 0.8rem;
	}

	.cont {
		min-width: 250px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1rem;
		flex-direction: column;
		background-color: var(--color-bg-1);
	}
</style>
