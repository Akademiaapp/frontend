<script lang="ts">
	import '../app.pcss';
	import { isOnline, themeVariant } from './store';
	// import { ServiceWorker } from 'sveltekit-adapter-versioned-worker/svelte';

	import './styles.css';
	import './tiptap-styles.scss';
	import 'katex/dist/katex.min.css';
	import { Toaster } from '@/components/ui/sonner';
	export let themeName = `dark`;
	import { supabase } from '@/supabase/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { session, userInfo } from './store';

	const themes = {
		default: {
			light: 'light',
			dark: 'dark'
		},
		word: {}
	};

	// $: console.log('docs', $documents);

	let currentTheme = themes.default;

	themeVariant.subscribe((it) => {
		themeName = it ? 'light' : 'dark';
	});

	onMount(() => {
		$isOnline = navigator.onLine;
		window.ononline = () => ($isOnline = true);
		window.onoffline = () => ($isOnline = false);

		if ($isOnline) {
			supabase.auth.getSession().then(({ data }) => {
				$session = data.session;
				if (data.session === null || data.session === undefined) {
					goto('/onboarding/login');
				} else {
					supabase
						.from('user')
						.select('*')
						.eq('id', data.session.user.id)
						.single()
						.then(({ data }) => userInfo.set(data));
				}
			});

			supabase.auth.onAuthStateChange((_event, _session) => {
				$session = _session;
				console.log('Session:', _session);
				if (_session === null || _session === undefined) {
					goto('/onboarding/login');
				} else {
					supabase
						.from('user')
						.select('*')
						.eq('id', _session.user.id)
						.single()
						.then(({ data }) => userInfo.set(data));
				}
			});
		}
	});

	$: console.log('Session:', session);

	$: if (!$session && $isOnline) {
		goto('/onboarding/login');
	}
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
	/>
	<link rel="stylesheet" href="/themes/{currentTheme[$themeVariant]}.css" />
	<!-- <meta name="color-scheme" content={$themeVariant} /> -->
</svelte:head>

{#if ($session && $userInfo) || $page.url.pathname.includes('/onboarding') || !isOnline}
	<div class="app">
		<slot />
	</div>
{/if}

<div class="absolute -right-12 top-6 text-xl p-1 overflow-visible w-48 text-center bg-yellow-300 rotate-45 z-50">
	<b>Beta!</b>
</div>

<!-- <ServiceWorker /> -->
<Toaster />

<style>
	.app {
		flex-direction: column;
		min-height: 100vh;
	}
</style>
