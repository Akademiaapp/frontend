<script lang="ts">
	import '../app.pcss';
	import { themeVariant } from './store';
	import Keycloak from 'keycloak-js';
	import { userInfo, type UserInfo, keycloakState } from '../authStore';
	import { goto } from '$app/navigation';

	import './styles.css';
	import './tiptap-styles.scss';
	import 'katex/dist/katex.min.css';
	export let themeName = `dark`;

	const themes = {
		default: {
			light: 'light',
			dark: 'dark'
		},
		word: {}
	};
	$: console.log($themeVariant);

	let currentTheme = themes.default;

	themeVariant.subscribe((it) => {
		themeName = it ? 'light' : 'dark';
	});

	keycloakState.set(
		new Keycloak({
			url: 'https://auth.akademia.cc/',
			realm: 'akademia',
			clientId: 'akademia-frontend'
		})
	);

	let loggedIn = false;

	$keycloakState
		.init({
			onLoad: 'check-sso'
		})
		.then((authenticated) => {
			if (authenticated) {
				$keycloakState.loadUserInfo().then((userInfoKc) => {
					loggedIn = true;
					userInfo.set({ ...userInfoKc, token: $keycloakState.token } as UserInfo);
					console.log('User info:', userInfoKc);
					goto('/workspace/home');
				});
				// Check if user exists in own db
			} else {
				loggedIn = false;
				goto('/signin');
			}
		})
		.catch((e) => {
			console.error(e);
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

<div class="app">
	<slot />
</div>

<style>
	.app {
		flex-direction: column;
		min-height: 100vh;
	}
</style>
