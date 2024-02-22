<script lang="ts">
	import Assignment from './Assignment.svelte';
	import { Notebook, Target, File } from 'lucide-svelte';
	import { fileStore, userInfo, assignmentStore } from '@/api/apiStore';

	console.log($assignmentStore);
</script>

<div class="cont br-2 frontground">
	<h1>Velkommen, {$userInfo.name}</h1>
	<h2>
		<Target />
		Afleveringer
	</h2>
	<div class="filelist">
		{#each $assignmentStore as assignment}
			<Assignment
				name={assignment.name}
				progress={assignment.progress}
				date={new Date(Number(assignment.due_date)).toLocaleDateString('da-DK', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
					weekday: 'long',
				})}
			></Assignment>
		{/each}
		{#if $assignmentStore.length == 0}
			<p class="">Der er ingen afleveringer</p>
		{/if}
	</div>
	<h2>
		<File />
		Dokumenter
	</h2>
	<div class="filelist">
		{#each $fileStore as f}
			<Assignment name={f.name} id={f.id}></Assignment>
		{/each}
		{#if $fileStore.length == 0}
			<p class="">Der er ingen dokumenter</p>
		{/if}
	</div>
	<h2>
		<Notebook />
		Noter
	</h2>
	<div class="filelist">
		{#each $fileStore as f}
			<Assignment name={f.name} id={f.id}></Assignment>
		{/each}
		{#if $fileStore.length == 0}
			<p class="">Der er ingen noter</p>
		{/if}
	</div>
</div>

<style lang="scss">
	.cont {
		padding: 2rem;
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
