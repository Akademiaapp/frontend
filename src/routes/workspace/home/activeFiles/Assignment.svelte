<script lang="ts">
	import { Assignment, AssignmentProgress } from '@/api/apiStore';
	import { Check } from 'lucide-svelte';
	import AssignmentAnswer from './AssignmentAnswer.svelte';

	export let assingment: Assignment;
	export let date: string | undefined = undefined;

	let progressNumber = 5;
	let finished = false;
</script>

<a
	href={'/workspace/editor?id=' + assingment.id + '&type=' + assingment.fileType}
	class="reset cont frontground"
>
	<div class="text">
		<p class="name">{assingment.name}</p>
		<p class="date">Afleveringsdato {date}</p>
	</div>
	{#if !finished}
		<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle class="bg-circle" cx="11" cy="11" r="9" pathLength="100" stroke-width="3" />
			<circle
				class="progress-circle"
				class:red={progressNumber < 25}
				class:yellow={progressNumber >= 25 && progressNumber < 75}
				class:green={progressNumber >= 75}
				cx="11"
				cy="11"
				r="9"
				pathLength="100"
				stroke-width="3"
				style="stroke-dashoffset: {100 - progressNumber};"
			/>
		</svg>
	{:else}
		<Check color="#2cde00" />
	{/if}
</a>

<style lang="scss">
	.cont {
		display: flex;
		min-height: 2rem;

		justify-content: space-between;
		align-items: center;

		border-radius: 0.7rem;

		border: solid rgba(var(--rga), 0.06) 0.1rem;
		box-shadow: 0.05rem 0.05rem 0.7rem rgba(0, 0, 0, 0.06);

		padding: 0.4rem 1rem;

		gap: 0.5rem;

		transition: transform 300ms ease;

		&:hover {
			transform: translateY(-0.15rem);
			transition: transform 200ms ease;
		}
	}

	.text {
		max-width: 100%;
		p {
			margin: 0;
			text-wrap: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.date {
			color: var(--color-text-2);
			font-size: 0.6rem;

			transform: translateY(-0.15rem);
		}
	}

	svg {
		height: 100%;
		rotate: -90deg;

		.red {
			stroke: #ff0000;
		}

		.yellow {
			stroke: #ffa800;
		}

		.green {
			stroke: #2cde00;
		}

		.progress-circle {
			stroke-dasharray: 100;
			stroke-dashoffset: 0;

			stroke-linecap: round;

			transition: all 1s;

			animation: load-in 600ms ease-out;

			animation-fill-mode: backwards;

			z-index: 10;
		}

		.bg-circle {
			stroke: rgba(0, 0, 0, 0.15);
			position: absolute;
		}
	}

	@keyframes load-in {
		from {
			stroke-dashoffset: 100;
		}
	}
</style>
