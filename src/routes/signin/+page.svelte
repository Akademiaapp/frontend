<script lang="ts">
	import { goto } from '$app/navigation';
	import { keycloakState, userInfo } from '../../authStore';
	import { onMount } from 'svelte';

	let loggedIn = false;

	onMount(() => {
		if ($keycloakState.authenticated) {
			loggedIn = true;
			goto('/workspace/home');
		}
	});
</script>

<svelte:head>
	<title>Login | Akademia</title>
</svelte:head>

<div class="cont">
	<div class="login-cont">
		<img src="/favicon.png" class="logo" alt="Akademia logo" />
		<h1 class="header">Velkommen til Akademia!</h1>
		{#if loggedIn}
			hey
			<h3>Du er logget ind som {$userInfo.preferred_username}!</h3>
			<button on:click={() => {$keycloakState.logout();}}>Log ud</button>
		{:else}
			Du er ikke logget ind
			<button on:click={() => {$keycloakState.login();}}>Login</button>
		{/if}
	</div>
</div>

<style>
	h1,
	h2 {
		cursor: default;
		margin-top: 0;
		margin-bottom: 0;
	}
	.logo {
		width: 15rem;
		height: 15rem;
	}
	.cont {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}
	.login-cont {
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
