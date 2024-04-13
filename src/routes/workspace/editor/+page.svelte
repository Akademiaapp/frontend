<script lang="ts">
	import Toolbar from './Toolbar/Toolbar.svelte';
	import FileEditor from './FileEditor.svelte';
	import api from '@/api';
	import { goto } from '$app/navigation';
	import {
		currentFile,
		documentStore,
		assignmentAnswerStore,
		assignmentStore
	} from '@/api/apiStore';
	import {
		DocumentInfo,
		Assignment,
		AssignmentAnswer,
		AssignmentProgress
	} from '@/api/fileClasses';
	import AnswerSelector from './Toolbar/AnswerSelector.svelte';
	import { sidebarWidth } from '../../store';
	import 'https://unpkg.com/@cortex-js/compute-engine?module';

	var urlParams = new URLSearchParams(window.location.search);
	var id = urlParams.get('id');
	var documentType = urlParams.get('type');
	let isNote = documentType === 'notes';
	$: isNote = $currentFile instanceof DocumentInfo && $currentFile.isNote;

	var apiType = documentType === 'notes' ? 'documents' : documentType;

	if (!id) {
		goto('/workspace/home');
	}

	if (!$currentFile) {
		api.callApi(`/${apiType}/${id}`, null, 'GET').then((file) => {
			if (!file) return;
			file.json().then((fileContent) => {
				if (apiType === 'documents') {
					currentFile.set(new DocumentInfo(fileContent, documentStore));
				} else if (apiType === 'assignmentAnswers') {
					currentFile.set(new AssignmentAnswer(fileContent, assignmentAnswerStore));
				} else if (apiType === 'assignments') {
					currentFile.set(new Assignment(fileContent, assignmentStore));
				}
			});
		});
	}
	let value;
</script>

<svelte:head>
	<title>{$currentFile?.name || 'Editor'} | Akademia</title>
</svelte:head>

{#if $currentFile}
	<div class="editor" style:width={'calc(100% - ' + $sidebarWidth + ')'}>
		{#if $currentFile instanceof AssignmentAnswer && $currentFile.progress === AssignmentProgress.SUBMITTED}
			<p>Du har afleveret denne opgave. Afventer feedback fra din lærer.</p>
		{:else if $currentFile instanceof AssignmentAnswer && $currentFile.progress === AssignmentProgress.GRADED}
			<p>Din lærer har givet feedback på denne opgave. Du har fået {$currentFile.grade}.</p>
		{:else if $currentFile instanceof Assignment && $currentFile.isPublic}
			<p>Denne opgave er offentlig og kan ikke redigeres.</p>
			<AnswerSelector />
		{:else}
			<Toolbar bind:isNote />
		{/if}
		<FileEditor bind:isNote />
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
