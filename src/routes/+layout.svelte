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
	import { Info, X } from 'lucide-svelte';

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

	let bannerHeight = '3rem';
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
	<div class="h-[100vh] overflow-auto pt-[--nb-h]" style:--nb-h={bannerHeight}>
		{#if bannerHeight !== '0px'}
			<div
				class="sticky top-0 mx-2.5 -mb-[--nb-h] flex h-[--nb-h] -translate-y-[--nb-h] items-center gap-1 rounded-b-sm bg-blue-300 px-2.5"
			>
				<Info class="h-5"></Info>
				<p>
					<b>Beta Version:</b> Things might be a little rough around the edges. Thank you for your patience!
				</p>
				<div class="flex-1"></div>
				<button
					on:click={() => {
						bannerHeight = '0px';
					}}
				>
					<X class="h-5"></X>
				</button>
			</div>
		{/if}

		<div class="app">
			<slot />
		</div>
	</div>
{/if}

<!-- <ServiceWorker /> -->
<Toaster />

<style>
	.app {
		flex-direction: column;
		min-height: calc(100vh - var(--nb-h));
	}
</style>
