<script lang="ts">
	import Assignment from './Assignment.svelte';
	let assignments: { name: string, progress: number }[] = [
		{ name: 'beskrivende tekst', progress: 100 },
		{ name: 'Matmatik aflevering', progress: 50 },
		{ name: 'Matmatik aflevering', progress: 0 }
	];
</script>

<div class="container br-2 frontground">
	<h2>Asignments</h2>
	<div class="filelist">
		{#each assignments as assignment}
			<Assignment name={assignment.name} progress={assignment.progress} date="3. jan"></Assignment>
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
	}

	.filelist {
		display: grid;
		gap: var(--gap);
		height: auto;
		grid-template-columns: repeat(3, 1fr);
	}
</style>
