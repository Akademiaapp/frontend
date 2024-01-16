<script lang="ts">
	import Assignment from './Assignment.svelte';
	import ApiHandler from '$lib/api';
	import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
	import type { Readable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';

	let assignments: { name: string, progress: number }[] = [
		{ name: 'beskrivende tekst', progress: 100 },
		{ name: 'Matmatik aflevering', progress: 50 },
		{ name: 'Matmatik aflevering', progress: 0 }
	];
	const api = new ApiHandler(<Readable<AuthorizerState>>getContext('authorizerContext'));

	interface File {
		name: string;
		id: string;
	}

	export let files: File[] = [];
	onMount(async () => {
		files = await (await api.getUserDocuments()).json();
		console.log(files)
	})
</script>

<div class="container br-2 frontground">
	<h2>Asignments</h2>
	<div class="filelist">
		{#each assignments as assignment}
			<Assignment name={assignment.name} progress={assignment.progress} date="3. jan"></Assignment>
		{/each}
	</div>
	<h2>Documents</h2>
	<div class="filelist">
		{#each files as f}
			<Assignment name={f.name} id={f.id} date="3. jan"></Assignment>
		{/each}
	</div>
</div>

<style>
	.container {
		padding: 3rem;
		display: flex;
		flex-direction: column;
	}

	h2 {
		margin: 0;
		margin-bottom: 1rem;
		padding-left: 0.3rem;
	}

	.filelist {
		display: grid;
		gap: var(--gap);
		height: auto;
		grid-template-columns: repeat(3, 1fr);
		margin-bottom: 2rem;
	}
</style>
