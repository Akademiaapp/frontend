<script lang="ts">
	import Assignment from './Assignment.svelte';
	let assignments: {name: string}[] = [{ name: 'beskrivende tekst' }, {name: "Matmatik aflevering"}];
</script>

<div class="container br-2 frontground">
    <h2>Asignments</h2>
	<div class="filelist">
		{#each assignments as assignment}
			<Assignment name={assignment.name} date="jan"></Assignment>
		{/each}
	</div>
</div>

<style>
	.container {
		padding: 3rem;
	}

	h2 {
		margin: 0;
	}

	.filelist {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}
</style>
