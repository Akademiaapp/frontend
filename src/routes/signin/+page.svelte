<script lang="ts">
	import Keycloak from 'keycloak-js';
	import { userInfo } from '../../authStore';

	const keycloak = new Keycloak({
		url: 'http://localhost:8080/',
		realm: 'akademia',
		clientId: 'akademia-frontend',
	});

	let loggedIn = false;

	keycloak.init({
		onLoad: 'login-required',
	}).then((authenticated) => {
		console.log("tyest")
		loggedIn = authenticated;
		if (loggedIn) {
			console.log('authenticated', authenticated);
			loggedIn = true;
			
			keycloak.loadUserInfo().then((userInfoKc) => {
				userInfo.set(userInfoKc);
			});
		}
	}).catch((e) => {
		console.error(e);
	});
	console.log('loggedIn', loggedIn);

</script>

<svelte:head>
	<title>Login | Akademia</title>
</svelte:head>

<div class="cont">
	<div class="login-cont">
		<img src="/favicon.png" class="logo" alt="Akademia logo" />
		<h1 class="header">Velkommen til Akademia!</h1>
		{#if loggedIn}
			<h2>Du er logget ind som {$userInfo.preferred_username}!</h2>
			<button on:click={() => {keycloak.logout();}}>Log ud</button>
		{:else}
			Du er ikke logget ind
			<button on:click={() => {keycloak.login();}}>Login</button>
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
