<script>
	import { isThemeChecked } from './store';

	import './styles.css';
	export let themeName = `dark`;

	isThemeChecked.subscribe((it) => {
		themeName = it ? 'dark' : 'light';
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="/themes/{themeName}.css" />
</svelte:head>

<div class="app">
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		/* padding: 1rem; */
		width: 100%;
		/* max-width: 64rem; */
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
