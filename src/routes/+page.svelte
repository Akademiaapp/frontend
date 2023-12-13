<script>
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="home">
	<p>
		<img src="/favicon.png" class="logo" alt="Akademia logo" />
	</p>
	<h1>
		Welcome to Akademia
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

	.logo {
		width: 20rem;
		height: 20rem;
	}

	.home {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
