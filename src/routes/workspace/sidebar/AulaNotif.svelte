<script lang="ts">
	let notfiCount = 2;
</script>

<div class="bg br-2 relative">
	<img
		src="https://aulainfo.dk/wp-content/themes/aula-info/assets/img/logo__aula--white.svg"
		alt="aula logo"
	/>
	<p class="absolute -right-0.5 -top-1 min-w-4 rounded-full bg-red-600 p-0 text-center text-xs">
		{notfiCount}
	</p>
</div>

<style>
	.bg {
		background-color: rgb(24, 99, 143);

		margin: 0 0.5rem;
		aspect-ratio: 1;
		border-radius: 100rem;
		display: grid;
		place-items: center;
	}

	img {
		width: 1.5rem;
	}
</style>
