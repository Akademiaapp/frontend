<script lang="ts">
	import { getContext } from 'svelte';
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
		console.log(state);
	});

	const userHandler = async () => {
		if (!state.token) {
			goto('/login');
		} else {
			await state.logout();
		}
	};
</script>

<img on:click={userHandler} class="avatar" src={state.user?.picture} alt="User avatar" />

<style lang="scss">
	.avatar {
		width: 2rem;
		height: 2rem;
		cursor: pointer;
		border-radius: 100%;
		overflow: hidden;
	}
</style>
