<script lang="ts">
	import { getContext } from 'svelte';
	import { Authorizer } from '@authorizerdev/authorizer-svelte';
	import { goto } from '$app/navigation';

	interface AuthorizerState {
		token: string;
		user: any;
		loading: boolean;
		logout: Function;
		subscribe: Function;
	};

	let state: AuthorizerState;

	const store: AuthorizerState = getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
		if (state.user?.preferred_username) {
			goto('/workspace');
		}
	});

	const logoutHandler = async () => {
		await state.logout();
	};
</script>

{#if state.token}
	<div>
		<h1>Hey {state.user?.preferred_username}</h1>
		<p>Thank you for using Akademia! We are still in development..</p>
		<br />
		{#if state.loading}
			<h3>Processing....</h3>
		{:else}
			<h3 style="color: #3B82F6; cursor: pointer;" on:click={logoutHandler}>Logout</h3>
		{/if}
	</div>
{:else}
	<div class="login-container">
		<h1>Welcome to Akademia</h1>
		<br />
		<Authorizer />
	</div>
{/if}

<style>
	.login-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
