<script>
	import { Loader2 } from 'lucide-svelte';
	import { supabase } from '@/supabaseClient';
	import { Button } from './ui/button';

	export let icon = '';
	export let name = '';
	export let providerName = '';
	export let isLoading = false;
	export let redirectUri = '';

	export let additionalAction = () => {};
</script>

<Button
	variant="outline"
	type="button"
	disabled={isLoading}
	on:click={() => {
		supabase.auth.signInWithSSO({providerId: providerName, options: { redirectTo: redirectUri } });
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
