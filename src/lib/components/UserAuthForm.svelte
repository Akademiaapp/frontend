<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import SocialLogonButton from './SocialLogonButton.svelte';
	import { supabase } from '@/supabase/supabaseClient';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let isLoading = false;

	export let actionName = 'Sign In';
	export let onSubmit = () => {
		isLoading = true;

		let email = (document.getElementById('email') as HTMLInputElement).value;
		let password = (document.getElementById('password') as HTMLInputElement).value;

		setTimeout(() => {
			isLoading = false;
		}, 3000);

		if (actionName === 'Sign In') {
			supabase.auth.signInWithPassword({ email, password });
			return;
		} else if (actionName === 'Sign Up') {
			supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectUri } });
			return;
		}
	};

	// Full redirect url
	export let redirectUri = $page.url.host + '/onboarding/login';
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
				<Input
					id="password"
					type="password"
					disabled={isLoading}
					placeholder="Password"
				/>
			</div>
			<Button type="submit" disabled={isLoading}>
				{#if isLoading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				{actionName} with Email
			</Button>
			{#if actionName === 'Sign In'}
				<Button
					type="button"
					variant="link"
					disabled={isLoading}
					on:click={() => goto('/onboarding/forgot-password')}
					class="text-sm text-muted-foreground h-min py-0"
				>
					Forgot password?
				</Button>
			{/if}
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
		<SocialLogonButton
			name="Google"
			providerName="google"
			icon="/icons/social/google.svg"
			{isLoading}
			{redirectUri}
		/>
		<SocialLogonButton
			name="Microsoft"
			providerName="azure"
			icon="/icons/social/microsoft.svg"
			{isLoading}
			{redirectUri}
		/>
	</div>
</div>
