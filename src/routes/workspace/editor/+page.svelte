<script lang="ts">
	import Toolbar from './Toolbar/Toolbar.svelte';
	import FileEditor from './FileEditor.svelte';
	import { goto } from '$app/navigation';
	import { currentFile } from '@/api/apiStore';
	import AnswerSelector from './Toolbar/AnswerSelector.svelte';
	import { sidebarWidth } from '../../store';
	import 'https://unpkg.com/@cortex-js/compute-engine?module';
	import { documents, assignmentAnswers, assignments } from '@/supabase/supabaseClient';

	var urlParams = new URLSearchParams(window.location.search);
	var id = urlParams.get('id');
	var documentType = urlParams.get('type');
	let is_note: boolean = documentType === 'notes';
	$: is_note = 'is_note' in $currentFile && $currentFile.is_note;

	var apiType = documentType === 'notes' ? 'documents' : documentType;

	if (!id) {
		goto('/workspace/home');
	}

	if (!$currentFile) {
		if (apiType === 'documents') {
			$documents.map((doc) => {
				if (doc.id === id) {
					currentFile.set(doc);
				}
			});
		} else if (apiType === 'assignmentAnswers') {
			$assignmentAnswers.map((doc) => {
				if (doc.id === id) {
					currentFile.set(doc);
				}
			});
		} else if (apiType === 'assignments') {
			$assignments.map((doc) => {
				if (doc.id === id) {
					currentFile.set(doc);
				}
			});
		}
	}
	let value;

	$: status = 'status' in $currentFile ? $currentFile.status : null;
</script>

<svelte:head>
	<title>{$currentFile?.id || 'Editor'} | Akademia</title>
</svelte:head>
{#if $currentFile}
	<div class="editor" style:width={'calc(100% - ' + $sidebarWidth + ')'}>
		{#if status === 'submitted'}
			<p>Du har afleveret denne opgave. Afventer feedback fra din lærer.</p>
		{:else if status === 'graded'}
			<p>
				Din lærer har givet feedback på denne opgave. Du har fået {'grade' in $currentFile &&
					$currentFile.grade}.
			</p>
		{:else if 'isPublic' in $currentFile && $currentFile.isPublic}
			<p>Denne opgave er offentlig og kan ikke redigeres.</p>
			<AnswerSelector />
		{:else}
			<Toolbar bind:is_note />
		{/if}
		<FileEditor bind:is_note />
	</div>
{/if}

<style>
	.editor {
		height: 100%;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		/* padding-left: var(--gap); */

		transition: all 300ms;
	}
</style>
