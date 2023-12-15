<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';

	export let name = false;

	interface AuthorizerState {
		token: string;
		user: any;
		loading: boolean;
		logout: Function;
		subscribe: Function;
	}

	let state: AuthorizerState;

	const store: AuthorizerState = getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
		console.log(state);
		console.log(state.user?.preferred_username.split(/[@.]/)[0]);
		console.log('name: ' + getUserName());
	});

	function getUserName(): String {
		console.log(state.user?.given_name);
		return state.user?.given_name === ''
			? state.user?.preferred_username.split(/[@.]/)[0]
			: state.user?.given_name;
	}

	const userHandler = async () => {
		if (!state.token) {
			goto('/login');
		} else {
			await state.logout();
		}
	};
</script>

<div class="container">
	<img on:click={userHandler} class="avatar br-2" src={state.user?.picture} alt="User avatar" />
	{#if name}
		<p>
			{getUserName()}
		</p>
	{/if}
</div>

<style lang="scss">
	p {
		margin: 0;
		font-weight: bold;
		color: var(--color-text-1);
	}
	.container {
		display: flex;
		gap: 0.75rem;
		justify-self: center;
		align-items: center;
	}
	.avatar {
		width: 2rem;
		height: 2rem;
		cursor: pointer;
		overflow: hidden;
	}
</style>
