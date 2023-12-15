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
		if (state.user?.preferred_username) {
			goto('/workspace');
		}
	});
</script>

<section class="home">
	<p>
		<img src="/favicon.png" class="logo" alt="Akademia logo" />
	</p>
	<h1>
		Welcome to Akademia
	</h1>

	<h2>A new way of leaning, writing and remembering!</h2>
	<a href="/workspace">
		<button class="colored-button">Enter workspace</button>
	</a>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	.logo {
		width: 20rem;
		height: 20rem;
	}

	.home {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
