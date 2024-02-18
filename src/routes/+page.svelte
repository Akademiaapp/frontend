<script lang="ts">
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
	import type { Readable } from 'svelte/store';

	let state: AuthorizerState;
	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
		if (state.token) {
			goto('/workspace/home');
		} else {
			goto('/signin');
		}
	});
</script>
