<script lang="ts">
	export let icon: string;
	export let action = () => {};
</script>

<button class="cont b2" on:click={action}>
	<span class="material-symbols-rounded"> {icon} </span>
</button>

<style lang="scss">
	button {
		outline: none;
		border: none;
		background-color: transparent;
	}

	.cont {
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
		transition: color 100ms;
		&:hover {
			color: var(--color-text-0);
			transform: translateY(-0.05rem);

			transition: transform 100ms;
		}
		transition: transform 400ms;
	}
</style>
