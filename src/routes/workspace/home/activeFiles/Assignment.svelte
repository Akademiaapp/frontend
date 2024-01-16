<script lang="ts">
	import { capLength } from "$lib/utils/stringUtils";

	export let name: string;
	export let date: string;
	export let progress: number = -1;
	export let id: string = "Test"


</script>

<a href={"/workspace/editor?id=" + id} class="reset container frontground">
	<div class="text">
		<p class="name">{capLength(name, 25)}</p>
		<p class="date">Created {date}</p>
	</div>
	{#if progress >= 0}
		 <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
			 <circle
			 class="bg-circle"
			 cx="10.3349"
			 cy="10.9299"
			 r="9.08329"
			 pathLength="100"
			 stroke-width="2.50515"
			 />
			 <circle
				 class="progress-circle"
				 class:completed={progress == 100}
				 cx="10.3349"
				 cy="10.9299"
				 r="9.08329"
				 pathLength="100"
				 stroke-width="2.50515"
				 style="stroke-dashoffset: {100-progress};"
			 />
		 </svg>
	{/if}
</a>

<style lang="scss">
	.container {
		display: flex;

		justify-content: space-between;
		align-items: center;

		border-radius: 0.7rem;

		border: solid rgba(var(--rga), 0.06) 0.1rem;
		box-shadow: 0.05rem 0.05rem 0.7rem rgba(0, 0, 0, 0.06);

		padding: 0.4rem 1rem;

		gap: 2rem;

		transition: transform 300ms ease;

		&:hover {
			transform: translateY(-0.15rem);
			transition: transform 200ms ease;

			
		}
	}

	.text {
		p {
			margin: 0;
			text-wrap: nowrap;
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

		.progress-circle {

			stroke: #FFA800;

			stroke-dasharray: 100;
			stroke-dashoffset: 0;

			stroke-linecap: round;

			transition: all 1s;

			animation: load-in 600ms ease-out;

			animation-fill-mode: backwards;	

			z-index: 10;
		}

		
		.completed {
			stroke: #2CDE00;
		}

		.bg-circle {
			stroke: rgba(0, 0, 0, 0.15);
			position: absolute;
		}
	}

	@keyframes load-in{
		from {
			stroke-dashoffset: 100;
		}
	}


</style>
