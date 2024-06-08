<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { keycloakState } from '../../authStore';
	import SocialLogonButton from './SocialLogonButton.svelte';

	export let isLoading = false;

	export let actionName = 'Sign In';
	export let onSubmit = () => {
		isLoading = true;

		let email = (document.getElementById('email') as HTMLInputElement).value;

		setTimeout(() => {
			isLoading = false;
		}, 3000);

		if (actionName === 'Sign In') {
			$keycloakState.login({ loginHint: email });
			return;
		} else if (actionName === 'Sign Up') {
			$keycloakState.register({ loginHint: email });
			return;
		}
	};

	export let redirectUri = '';
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
		<SocialLogonButton
			name="Google"
			providerName="google"
			icon="/icons/social/google.svg"
			{isLoading}
			{redirectUri}
		/>
		<SocialLogonButton
			name="Microsoft"
			providerName="microsoft"
			icon="/icons/social/microsoft.svg"
			{isLoading}
			{redirectUri}
		/>
	</div>
</div>
