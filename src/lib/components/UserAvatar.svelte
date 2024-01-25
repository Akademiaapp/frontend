<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
	import type { Readable } from 'svelte/store';
	import { userInfo } from '@/api/apiStore';

	export let name = false;

	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	// const userHandler = async () => {
	// 	if (!state.token) {
	// 		goto('/signin');
	// 	} else {
	// 		await state.logout();
	// 	}
	// };
	// on:click={userHandler}
</script>

<div class="cage">
	<img
		class="avatar br-2"
		src={$store.user?.picture}
		alt="User avatar"
		referrerpolicy="no-referrer"
	/>
	{#if name}
		<p>
			{$userInfo.name}
		</p>
	{/if}
</div>

<style lang="scss">
	p {
		margin: 0;
		font-weight: bold;
		color: var(--color-text-1);
	}
	.cage {
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
