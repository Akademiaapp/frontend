<script lang="ts">
	import Document from './Document.svelte';
	import Assignment from './Assignment.svelte';
	import { Notebook, Target, File, Plus } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import AssignmentAnswer from './AssignmentAnswer.svelte';
	import { userInfo } from '../../../store';
	import { assignmentAnswers, assignments, documents } from '@/supabase/supabaseClient';

	// let notes = $documentStore.filter((f) => f.isNote);
	// let documents = $documentStore.filter((f) => !f.isNote);

	// $: documents = $documentStore.filter((f) => !f.isNote);
	// $: notes = $documentStore.filter((f) => f.isNote);

	function newDocument(name: string = "Uden titel", isNote: boolean, open: boolean = false) {
		documents.insert({
			name: name,
			isNote: isNote
		});
		if (open) {
			// goto(`/workspace/editor?page?id=${id}&type=${isNote ? 'notes' : 'documents'}`);
		}
	}

	function newAssignment() {
		// goto('/workspace/editor?page?id=0&type=assignmentAnswers');
	}


</script>

<div class="cont br-2 frontground" id="overview">
	<h1>
		Velkommen, {$userInfo.full_name}
	</h1>
	<h2>
		<Target />
		Afleveringer
	</h2>
	<div class="mb-7">
		<div class="filelist">
			{#each $assignmentAnswers as assignment}
				<AssignmentAnswer
					name={assignment.name}
					progress={assignment.status}
					id={assignment.id}
					date={new Date(assignment.due_date).toLocaleDateString('da-DK', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric'
					})}
					grade={assignment.grade}
				/>
			{/each}
			{#each $assignments as assignment}
				<Assignment
					assingment={assignment}
					date={new Date(assignment.due_date).toLocaleDateString('da-DK', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric'
					})}
				/>
			{/each}
			{#if $assignmentAnswers.length == 0 && $assignments.length == 0}
				<p class="">Der er ingen afleveringer</p>
			{/if}
		</div>
		{#if $userInfo && ($userInfo.type == 'teacher' || $userInfo.type == 'tester')}
			<Button variant="outline" class="mt-4 h-auto py-1.5" on:click={() => newAssignment()}>
				<Plus size="19" />
				Opret aflevering
			</Button>
		{/if}
	</div>
	<h2>
		<File />
		Dokumenter
	</h2>
	<div class="mb-7">
		<div class="filelist">
			{#each $documents as f}
				<Document name={f.name} id={f.id} type="documents"></Document>
			{/each}
			{#if $documents.length == 0}
				<p class="">Der er ingen dokumenter</p>
			{/if}
		</div>
		<Button
			variant="outline"
			class="mt-4 h-auto py-1.5"
			on:click={() => newDocument('Uden titel', true, false)}
		>
			<Plus size="19" />
			Opret dokument
		</Button>
	</div>
	<h2>
		<Notebook />
		Noter
	</h2>
	<div class="mb-7">
		<div class="filelist">
			{#each $documents as f}
				<Document name={f.name} id={f.id} type="notes"></Document>
			{/each}
			{#if $documents.length == 0}
				<p class="">Der er ingen noter</p>
			{/if}
		</div>
		<Button
			variant="outline"
			class="mt-4 h-auto py-1.5"
			on:click={() => newDocument('Uden titel', true, true)}
		>
			<Plus size="19" />
			Opret note
		</Button>
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
	}
</style>
