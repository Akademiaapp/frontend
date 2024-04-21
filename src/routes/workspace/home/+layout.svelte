<script>
	import { answer } from '../editor/editorStore';
	import ActiveFiles from './activeFiles/ActiveFiles.svelte';
	import Calendar from './Calendar/Calendar.svelte';
	import { currentFile, updateAssignments, updateAssignmentsAnswers, updateDocuments } from '@/api/apiStore';
	currentFile.set(null);
	answer.set(null);

	import { onMount } from 'svelte';

	onMount(() => {
		updateAssignmentsAnswers();
		updateAssignments();
		updateDocuments();
	});
</script>

<svelte:head>
	<title>Dashboard | Akademia</title>
</svelte:head>

<ActiveFiles />
<Calendar />
<slot />
