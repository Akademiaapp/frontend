<script lang="ts">
	export let icon: string = '';
	export let action = () => {};
	export let active = false;
	export let tooltip = '';
</script>

<button class="cont b2" on:click={action} class:tooltip style:--tooltip={'"' + tooltip + '"'}>
	<span class="material-symbols-rounded" style:--icon={"'" + icon + "'"} class:active>
		<slot>
			{icon}
		</slot>
	</span>
</button>

<style lang="scss">
	button {
		outline: none;
		border: none;
		background-color: transparent;
		position: relative;
	}

	.tooltip::after {
		content: var(--tooltip);
		background-color: var(--color-bg-2);
		padding: 0.15rem 0.5rem;
		transform: translateX(calc(50% + 1rem));
		white-space: nowrap;
		position: absolute;
		opacity: 0;
		border-radius: 0.25rem;
		font-size: small;

		box-shadow: 0rem 0rem 0.4rem rgba(0, 0, 0, 0.1);

		transition: all 400ms 50ms;
	}

	.tooltip:hover::after {
		opacity: 1;
		transform: translateX(calc(50% + 1.2rem));
		transition: all 400ms 300ms;
	}

	.cont {
		display: grid;
		place-items: center;
		height: 2rem;
		width: 2rem;
		padding: 0rem;
		transition: box-shadow 400ms;

		&:hover {
			// 	box-shadow: 0.1rem 0.1rem 0.3rem rgba(0, 0, 0, 0.2);
		}

		// &:active {
		// 	box-shadow: 0.1rem 0.1rem 0.3rem rgba(0, 0, 0, 0.05);
		// 	transition: box-shadow 100ms;
		// }
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

		&::before {
			content: var(--icon);
			position: absolute;
			color: transparent;
			transition: color 400ms;

			font-variation-settings:
				'FILL' 100,
				'wght' 400,
				'GRAD' 0,
				'opsz' 24;
		}
		&.active {
			color: transparent;

			&::before {
				color: var(--color-text-0);
			}
		}
	}
</style>
