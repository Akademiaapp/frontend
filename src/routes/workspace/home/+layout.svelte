<script>
	import { answer } from '../editor/editorStore';
	import ActiveFiles from './activeFiles/ActiveFiles.svelte';
	import Calendar from './Calendar/Calendar.svelte';
	import { currentFile, updateDocuments } from '@/api/apiStore';
	currentFile.set(null);
	answer.set(null);

	import { onMount } from 'svelte';

	onMount(() => {
		updateDocuments();
	});
</script>

<svelte:head>
	<title>Dashboard | Akademia</title>
</svelte:head>

<ActiveFiles />
<Calendar />
<slot />
