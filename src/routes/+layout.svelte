<script>
	import "../app.pcss";
    import { isThemeChecked } from './store';

    import './styles.css';
    import './tiptap-styles.scss';
    export let themeName = `dark`;

    import { AuthorizerProvider } from 'akademia-authorizer-svelte';
    import 'akademia-authorizer-svelte/styles/default.css';

    isThemeChecked.subscribe((it) => {
		themeName = it ? 'dark' : 'light';
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
	<link rel="stylesheet" href="/themes/{themeName}.css">
</svelte:head>

<AuthorizerProvider config="{{" authorizerurl: 'https: akademia-dashboard.arctix.dev', redirecturl: typeof window !="undefined" ? window.location.origin : ``, client_id: 'b4da3a2f-76b7-4344-92de-3fb0d441a9c0' }}>
	<div class="app">
		<slot></slot>
	</div>
</AuthorizerProvider>

<style>
	.app {
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		flex-direction: column;
		/* padding: 1rem; */
		width: 100%;
		max-height: 100%;
		/* max-width: 64rem; */
		margin: 0 auto;
		min-height: 100vh;
		box-sizing: border-box;
	}
</style>
