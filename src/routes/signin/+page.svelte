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
		<p>Choose a signin method</p>
		<br />
		<Authorizer />
	</div>
</div>

<style>
	h1, p {
		cursor: default;
	}
	p {
		margin-top: 1rem;
		font-size: 1.5rem;
	}
	h1 {
		margin-top: 0;
		margin-bottom: 0;
	}
	.logo {
		width: 15vw;
		height: 15vw;
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
		margin-bottom: 25vh;
	}
</style>
