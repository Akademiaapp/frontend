<script lang="ts">
	import Toolbar from './Toolbar/Toolbar.svelte';
	import FileEditor from './FileEditor.svelte';
	import { goto } from '$app/navigation';
	import {
		currentFile
	} from '@/api/apiStore';
	import AnswerSelector from './Toolbar/AnswerSelector.svelte';
	import { sidebarWidth } from '../../store';
	import 'https://unpkg.com/@cortex-js/compute-engine?module';
	import { documents, assignmentAnswers, assignments } from '@/supabase/supabaseClient';
	import type { Tables } from '@/supabase.types';

	var urlParams = new URLSearchParams(window.location.search);
	var id = urlParams.get('id');
	var documentType = urlParams.get('type');
	let isNote: boolean = documentType === 'notes';
	$: isNote = ($currentFile as Tables<'document'>).isNote || false;

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
</script>

<svelte:head>
	<title>{$currentFile?.id || 'Editor'} | Akademia</title>
</svelte:head>
<!-- TODO
{#if $currentFile}
	<div class="editor" style:width={'calc(100% - ' + $sidebarWidth + ')'}>
		{#if $currentFile.status === 'SUBMITTED' }
			<p>Du har afleveret denne opgave. Afventer feedback fra din lærer.</p>
		{:else if $currentFile instanceof AssignmentAnswer && $currentFile.status === AssignmentStatus.GRADED}
			<p>Din lærer har givet feedback på denne opgave. Du har fået {$currentFile.grade}.</p>
		{:else if $currentFile instanceof Assignment && $currentFile.isPublic}
			<p>Denne opgave er offentlig og kan ikke redigeres.</p>
			<AnswerSelector />
		{:else}
			<Toolbar bind:isNote />
		{/if}
		<FileEditor bind:isNote />
	</div>
{/if} -->

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
