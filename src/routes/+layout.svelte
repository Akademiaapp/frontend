<script>
	import '../app.pcss';
	import { themeVariant } from './store';

	import './styles.css';
	import './tiptap-styles.scss';
	import 'katex/dist/katex.min.css'
	export let themeName = `dark`;

	const themes = {
		deafult: {
			light: 'light',
			dark: 'dark'
		},
		word: {}
	};
	$: console.log($themeVariant);

	let currentTheme = themes.deafult;

	import { AuthorizerProvider } from 'akademia-authorizer-svelte';
	import 'akademia-authorizer-svelte/styles/default.css';

	themeVariant.subscribe((it) => {
		themeName = it ? 'light' : 'dark';
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
	<link rel="stylesheet" href="/themes/{currentTheme[$themeVariant]}.css" />
	<meta name="color-scheme" content={$themeVariant} />
</svelte:head>

<AuthorizerProvider
	config={{
		authorizerURL: 'https://akademia-dashboard.arctix.dev',
		redirectURL: typeof window != 'undefined' ? window.location.origin : ``,
		client_id: 'b4da3a2f-76b7-4344-92de-3fb0d441a9c0'
	}}
>
	<div class="app">
		<slot />
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
