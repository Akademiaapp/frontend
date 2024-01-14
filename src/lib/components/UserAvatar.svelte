<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import type { AuthorizerState } from '@authorizerdev/authorizer-svelte/types';
	import type { Readable } from 'svelte/store';

	export let name = false;

	let state: AuthorizerState;

	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
	});

	function getUserName(): string {
		let name =
			state.user?.given_name === ''
				? state.user?.preferred_username.split(/[@.]/)[0]
				: state.user?.given_name;
		if (typeof name === 'string') {
			return name;
		} else {
			return 'User';
		}
	}

	const userHandler = async () => {
		if (!state.token) {
			goto('/signin');
		} else {
			await state.logout();
		}
	};
</script>

<div class="container">
	<img
		on:click={userHandler}
		class="avatar br-2"
		src={state.user?.picture}
		alt="User avatar"
		referrerpolicy="no-referrer"
	/>
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
