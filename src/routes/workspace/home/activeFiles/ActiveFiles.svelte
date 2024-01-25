<script lang="ts">
	import Assignment from './Assignment.svelte';
	import ApiHandler from '$lib/api';
	import { getContext, onMount } from 'svelte';
	import { Notebook, Target, File } from 'lucide-svelte';
	import { fileStore, userInfo } from '@/api/apiStore';

	let assignments: { name: string; progress: number }[] = [
		{ name: 'beskrivende tekst', progress: 100 },
		{ name: 'matematik aflevering', progress: 50 },
		{ name: 'matematik aflevering', progress: 0 }
	];

	const api = getContext('api') as ApiHandler;

	const context = api.getContext();
	onMount(async () => {
		files = await (await api.getUserDocuments()).json();
		console.log('Files: ', files);
		// assignments = await (await api.getAssignments()).json();
		console.log('Asignments: ', assignments);
	});
</script>

<div class="cont br-2 frontground">
	<h1>Welcome, {$userInfo.name}</h1>
	<h2>
		<Target></Target>
		Assignments
	</h2>
	<div class="filelist">
		{#each assignments as assignment}
			<Assignment name={assignment.name} progress={assignment.progress} date="3. jan"></Assignment>
		{/each}
	</div>
	<h2>
		<File></File>
		Documents
	</h2>
	<div class="filelist">
		{#each $fileStore as f}
			<Assignment name={f.name} id={f.id}></Assignment>
		{/each}
	</div>
	<h2>
		<Notebook></Notebook>
		Notes
	</h2>
	<div class="filelist">
		{#each $fileStore as f}
			<Assignment name={f.name} id={f.id}></Assignment>
		{/each}
	</div>
</div>

<style lang="scss">
	.cont {
		padding: 3rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	h2 {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		text-align: center;
		margin: 0;
		margin-bottom: 1rem;
		padding-left: 0.3rem;
	}

	.filelist {
		display: grid;
		gap: var(--gap);
		height: auto;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		margin-bottom: 2rem;
	}
</style>
