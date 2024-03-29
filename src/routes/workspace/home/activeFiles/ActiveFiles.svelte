<script lang="ts">
	import Document from './Document.svelte';
	import Assignment from './Assignment.svelte';
	import { Notebook, Target, File } from 'lucide-svelte';
	import { documentStore, assignmentAnswerStore } from '@/api/apiStore';
	import { keycloakUserInfo } from '../../../../authStore';

	console.log('assignments', $assignmentAnswerStore);
</script>

<div class="cont br-2 frontground" id="overview">
	<h1>
		Velkommen, {$keycloakUserInfo.given_name}
	</h1>
	<h2>
		<Target />
		Afleveringer
	</h2>
	<div class="filelist">
		{#each $assignmentAnswerStore as assignment}
			<Assignment
				name={assignment.name}
				progress={assignment.progress}
				id={assignment.answer_id}
				assignmentId={assignment.id}
				date={new Date(assignment.due_date).toLocaleDateString('da-DK', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric'
				})}
			/>
		{/each}
		{#if $assignmentAnswerStore.length == 0}
			<p class="">Der er ingen afleveringer</p>
		{/if}
	</div>
	<h2>
		<File />
		Dokumenter
	</h2>
	<div class="filelist">
		{#each $documentStore as f}
			<Document name={f.name} id={f.id}></Document>
		{/each}
		{#if $documentStore.length == 0}
			<p class="">Der er ingen dokumenter</p>
		{/if}
	</div>
	<h2>
		<Notebook />
		Noter
	</h2>
	<div class="filelist">
		{#each $documentStore as f}
			<Document name={f.name} id={f.id}></Document>
		{/each}
		{#if $documentStore.length == 0}
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
