<script>
	import File from './File.svelte';

	export let files = [
		'Test',
		'Dansk',
		'Matematik',
		'Fransk',
		'Fysik/Kemi',
		'Biologi',
		'Engelsk',
		'Kristendom',
		'Samfundsfag',
		'Valgfag',
		'Geografi',
		'Idræt',
		'Andet fag'
	];

	export let activeFile = 'Dansk';
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
