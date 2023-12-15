<script>
	import { getContext } from 'svelte';
	import { Authorizer } from '@authorizerdev/authorizer-svelte';

	/**
	 * @type {{ token: string; user: any; loading: boolean; logout: Function; }}
	 */
	let state;

	const store = getContext('authorizerContext');

	store.subscribe((/** @type {any} */ data) => {
		state = data;
	});

	const logoutHandler = async () => {
		await state.logout();
	};
</script>

{#if state.token}
	<div>
		<h1>Hey {state.user?.email}</h1>
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
		<h1>Welcome to Authorizer</h1>
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
