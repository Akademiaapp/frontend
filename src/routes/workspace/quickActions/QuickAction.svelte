<script lang="ts">
	export let icon: string;
	export let action = () => {};
</script>

<div class="container br-2">
	<img src={'icons/' + icon} alt="" />
</div>

<style lang="scss">
	.container {
		height: 2rem;
		width: 2rem;
		padding: 0rem;
		transition: box-shadow 400ms;
		// &:hover {
		// 	box-shadow: 0.1rem 0.1rem 0.3rem rgba(0, 0, 0, 0.2);
		// }

		// &:active {
		// 	box-shadow: 0.1rem 0.1rem 0.3rem rgba(0, 0, 0, 0.05);
		// 	transition: box-shadow 100ms;
		// }
	}
	img {
		height: 100%;
	}

	img :global(svg) {
		color: red;
	}
</style>
