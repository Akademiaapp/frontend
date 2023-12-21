<script lang="ts">
	import File from './File.svelte';
	import ApiHandler from '$lib/api';

	import { getContext, onMount } from 'svelte';
	import type { AuthorizerState } from '@authorizerdev/authorizer-svelte/types';
	import type { Readable } from 'svelte/store';

	const api = new ApiHandler(<Readable<AuthorizerState>>getContext('authorizerContext'));

	export let files: string[] = [];
	export let activeFile = '';

	onMount(async () => {
		const userDocuments = await api.getUserDocuments();
		
		files = (await userDocuments.json()).map((doc: { name: string }) => doc.name);
	});


</script>

<div class="container br-2">
	{#each files as file}
		<div>
			<File
				name={file}
				onClick={() => {
					activeFile = file;
				}}
				active={file == activeFile}
			></File>
		</div>
		<!-- content here -->
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 1.05rem;
		color: var(--color-text-2);
		background-color: var(--color-bg-1);
		padding: 8px;
		flex-grow: 1;
	}
</style>
