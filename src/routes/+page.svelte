<script>
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome"> Welcome to Akademia </span>
	</h1>

	<h2>A new way of leaning, writing and remembering!</h2>
	<a href="/workspace">
		<button class="colored-button">Enter workspace</button>
	</a>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	button {
		margin: 1rem;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / (2048 * 4)) 0;
	}
</style>
