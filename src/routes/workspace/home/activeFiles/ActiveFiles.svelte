<script lang="ts">
	import Document from './Document.svelte';
	import Assignment from './Assignment.svelte';
	import { Notebook, Target, File, Plus } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import AssignmentAnswer from './AssignmentAnswer.svelte';
	import { userInfo } from '../../../store';
	import { assignmentAnswers, assignments, documents } from '@/supabase/supabaseClient';
	import { newAssignment, newDocument } from '@/api/helpers';

	let notes = $documents.filter((f) => f.is_note);
	let documentsFiltered = $documents.filter((f) => !f.is_note);

	$: documentsFiltered = $documents.filter((f) => !f.is_note);
	$: notes = $documents.filter((f) => f.is_note);
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
			{#each documentsFiltered as f}
				<Document name={f.name} id={f.id} type="documents"></Document>
			{/each}
			{#if documentsFiltered.length == 0}
				<p class="">Der er ingen dokumenter</p>
			{/if}
		</div>
		<Button
			variant="outline"
			class="mt-4 h-auto py-1.5"
			on:click={() => newDocument('Uden titel', false, true)}
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
			{#each notes as f}
				<Document name={f.name} id={f.id} type="notes"></Document>
			{/each}
			{#if notes.length == 0}
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
