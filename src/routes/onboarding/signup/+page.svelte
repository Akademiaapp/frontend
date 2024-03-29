<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import UserAuthForm from '../../../lib/components/UserAuthForm.svelte';
	import { goto } from '$app/navigation';
	import { keycloakState } from '../../../authStore';
	import api from '@/api';

	let isLoading = false;

	$: if ($keycloakState.authenticated) {
		redirect().catch(console.error);
	}

	async function redirect() {
		// check if the user is correctly set up
		isLoading = true;
		const req = await api.callApi('isUserSetupCurrecly', null, 'GET');
		// const isUserSetupCurrecly = (await req.json()).isUserSetupCurrecly;
		const isUserSetupCurrecly = true;
		//TODO: change to actual fetching the data

		if (!isUserSetupCurrecly) {
			// if not, redirect to the onboarding
			goto('/onboarding');
		} else {
			// else redirect to the workspace
			goto('/workspace');
		}
	}
</script>

<div class="md:hidden">
	<img width={1280} height={843} alt="Authentication" class="block dark:hidden" />
	<img width={1280} height={843} alt="Authentication" class="hidden dark:block" />
</div>
<div
	class="container relative hidden flex-1 flex-col items-center justify-center bg-background p-0 md:grid lg:max-w-none lg:px-0"
>
	<Button href="/onboarding/login" variant="ghost" class="absolute -bottom-4 -left-8 ">Login</Button
	>

	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
				<p class="text-sm text-muted-foreground">Enter your email below to create your account</p>
			</div>
			<UserAuthForm actionName="Sign Up" bind:isLoading />
			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{' '}
				<a href="https://akademia.cc/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>{' '}
				and{' '}
				<a href="https://akademia.cc/privacy-policy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
