<script lang="ts">
	import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
	import TooltipContent from '@/components/ui/tooltip/tooltip-content.svelte';

	export let icon: string = '';
	export let action = () => {};
	export let active = false;
	export let tooltip = '';
</script>

<Tooltip>
	<TooltipTrigger>
		<button class="cont br-2 p-1.5" on:click={action} class:bg-muted={active}>
			<span class:active>
				<slot>
					{icon}
				</slot>
			</span>
		</button>
	</TooltipTrigger>
	<TooltipContent>{tooltip}</TooltipContent>
</Tooltip>

<style lang="scss">
	button {
		outline: none;
		border: none;
		// background-color: transparent;
		position: relative;

		display: grid;
		place-items: center;
		transition: box-shadow 400ms;
	}

	span {
		font-size: 2rem;

		color: #7f7f7f;

		&:hover {
			color: var(--color-text-0);
			transform: translateY(-0.05rem);

			transition:
				transform 100ms,
				color 400ms;
		}
		transition:
			color 400ms,
			transform 400ms;

		&.active {
			color: hsl(var(--foreground));
		}
	}
</style>
