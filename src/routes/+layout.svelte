<script lang="ts">
	import '../app.pcss';
	import { themeVariant } from './store';

	import './styles.css';
	import './tiptap-styles.scss';
	import 'katex/dist/katex.min.css';
	import { Toaster } from '@/components/ui/sonner';
	export let themeName = `dark`;
	import { supabase } from '@/supabase/supabaseClient';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { session } from './store';

	const themes = {
		default: {
			light: 'light',
			dark: 'dark'
		},
		word: {}
	};

	let currentTheme = themes.default;

	themeVariant.subscribe((it) => {
		themeName = it ? 'light' : 'dark';
	});

	onMount(() => {
		supabase.auth.getSession().then(({ data }) => {
			$session = data.session
		})

		supabase.auth.onAuthStateChange((_event, _session) => {
			$session = _session
		})
	})

	$: console.log('Session:', session);

	$: if (!$session) {
		goto('/onboarding/login')
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

{#if $session || $page.url.pathname.includes('/onboarding')}
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
