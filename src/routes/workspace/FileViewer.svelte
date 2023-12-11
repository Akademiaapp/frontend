<script>
	import File from './File.svelte';

	export let files = ['Dansk', 'Matmatik', 'Fransk', 'Fysik/Kemi', 'Biologi'];
</script>

<div class="container">
	{#each files as file}
		<div>
			<File name={file}></File>
		</div>
		<!-- content here -->
	{/each}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 1.1rem;
		color: #676767;
	}
</style>
