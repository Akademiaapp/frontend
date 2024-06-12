<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import { supabase } from '@/supabase/supabaseClient';
	import { Button } from './ui/button';
	import type { Provider } from '@supabase/supabase-js';

	export let icon = '';
	export let name = '';
	export let providerName: Provider | null;
	export let isLoading = false;
	export let redirectUri = '';

	export let additionalAction = () => {};
</script>

<Button
	variant="outline"
	type="button"
	disabled={isLoading}
	on:click={() => {
		supabase.auth.signInWithOAuth({
			provider: providerName,
			options: {
				redirectTo: window.location.origin
			}
		});
		additionalAction();
	}}
>
	{#if isLoading}
		<Loader2 class="mr-2 h-4 w-4 animate-spin" />
	{:else}
		<img src={icon} alt={name} class="mr-2 h-4 w-4" />
	{/if}
	{name}
</Button>
