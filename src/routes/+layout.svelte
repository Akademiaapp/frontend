<script lang="ts">
	import '../app.pcss';
	import { themeVariant } from './store';
	import Keycloak from 'keycloak-js';
	import { userInfo, type UserInfo, keycloakState } from '../authStore';
	import { goto } from '$app/navigation';

	import './styles.css';
	import './tiptap-styles.scss';
	import 'katex/dist/katex.min.css';
	import { page } from '$app/stores';
	import { Toaster } from '@/components/ui/sonner';
	import { getAuthUrl } from '@/utils';
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
			url: getAuthUrl(),
			realm: 'akademia',
			clientId: 'akademia-frontend'
		})
	);

	$keycloakState
		.init({
			onLoad: 'check-sso'
		})
		.then((authenticated) => {
			console.log(
				$keycloakState.createRegisterUrl({ redirectUri: window.location.hostname + '/onboarding' })
			);
			if (authenticated) {
				// Check if token is valid
				$keycloakState.loadUserInfo().then((userInfoKc) => {
					userInfo.set({ ...userInfoKc } as UserInfo);
					console.log('User info:', userInfoKc);
					console.log('Token:', $keycloakState.token);
					setInterval(() => {
						$keycloakState.updateToken(70).then((refreshed) => {
							if (refreshed) {
								console.log('Token refreshed');
							} else {
								console.log('Token not refreshed, valid for another 70 seconds');
							}
						});
					}, 6000);
					keycloakState.update((it) => it);
					console.log('Authenticated');
				});
			} else {
				console.log('Not authenticated');
				// reload page
				if ($page.url.pathname.endsWith('/register')) {
					window.location.href = $keycloakState.createRegisterUrl({
						redirectUri: window.location.hostname + '/onboarding'
					});
				} else {
					$keycloakState.login();
				}
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
	<!-- <meta name="color-scheme" content={$themeVariant} /> -->
</svelte:head>

{#if $keycloakState.authenticated}
	<div class="app">
		<slot />
	</div>
{/if}

<Toaster />

<style>
	.app {
		flex-direction: column;
		min-height: 100vh;
	}
</style>
