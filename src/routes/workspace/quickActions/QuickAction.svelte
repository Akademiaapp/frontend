<script lang="ts">
	export let icon: string;
	export let action = () => {};
</script>

<button class="container b2" on:click={action}>
	<img src={'icons/' + icon} alt="" />
</button>

<style lang="scss">
	button {
		outline: none;
		border: none;
		background-color: transparent;
	}

	.container {
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

	img {
		height: 100%;

		filter: invert(var(--invert-0));

		transition: filter 100ms;

		&:hover {
			filter: invert(var(--invert-1));
		}
	}
</style>
