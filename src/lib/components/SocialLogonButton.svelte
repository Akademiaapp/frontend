<script>
	import { Loader2 } from 'lucide-svelte';
	import { keycloakState } from '../../authStore';
	import { Button } from './ui/button';

	export let icon = '';
	export let name = '';
	export let keycloakName = '';
	export let isLoading = false;
	export let redirectUri = '';

	export let additionalAction = () => {};
</script>

<Button
	variant="outline"
	type="button"
	disabled={isLoading}
	on:click={() => {
		$keycloakState.login({ idpHint: keycloakName, redirectUri });
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
