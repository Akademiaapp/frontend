<script lang="ts">
	import { getContext } from 'svelte';
	import { Authorizer } from '@authorizerdev/authorizer-svelte';
	import { goto } from '$app/navigation';
	import type { Readable } from 'svelte/store';
	import type { AuthorizerState } from '@authorizerdev/authorizer-svelte/types';

	let state: AuthorizerState;
	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
		if (state.token) {
			goto('/workspace');
		}
	});
</script>

<div class="container">
	<div class="login-container">
		<img src="/favicon.png" class="logo" alt="Akademia logo" />
		<h1 class="header">Welcome to Akademia</h1>
		<h2>Choose a signin method</h2>
		<br />
		<Authorizer />
	</div>
</div>

<style>
	h1, h2 {
		cursor: default;
		margin-top: 0;
		margin-bottom: 0;
	}
	.logo {
		width: 15rem;
		height: 15rem;
	}
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}
	.login-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 22vw;
		height: 100vh;
		padding-bottom: 20vh;
		gap: 0.5rem;
		min-width: fit-content;
	}
</style>
