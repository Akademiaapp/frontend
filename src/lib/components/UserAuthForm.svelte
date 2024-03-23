<script lang="ts">
	import { Github, Loader2 } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { keycloakState } from '../../authStore';

	export let isLoading = false;

	export let actionName = 'Sign In';
	export let onSubmit = () => {
		isLoading = true;

		setTimeout(() => {
			isLoading = false;
		}, 3000);
	};
</script>

<div class="grid gap-6" {...$$restProps}>
	<form on:submit|preventDefault={onSubmit}>
		<div class="grid gap-2">
			<div class="grid gap-1">
				<Input
					id="email"
					placeholder="name@example.com"
					type="email"
					autocapitalize="none"
					autocomplete="email"
					autocorrect="off"
					disabled={isLoading}
				/>
			</div>
			<Button type="submit" disabled={isLoading}>
				{#if isLoading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				{actionName} with Email
			</Button>
		</div>
	</form>
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t" />
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<Button variant="outline" type="button" disabled={isLoading}>
			{#if isLoading}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				<img src="/icons/social/google.svg" alt="google" class="mr-2 h-4 w-4" />
			{/if}
			Google
		</Button>
		<Button
			variant="outline"
			type="button"
			disabled={isLoading}
			on:click={() => $keycloakState.login({ idpHint: 'microsoft' })}
		>
			{#if isLoading}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				<img src="/icons/social/microsoft.svg" alt="Microsoft" class="mr-2 h-4 w-4" />
			{/if}
			Microsoft
		</Button>
	</div>
</div>
