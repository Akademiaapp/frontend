<script>
	import { answer } from '../editor/editorStore';
	import ActiveFiles from './activeFiles/ActiveFiles.svelte';
	import Calendar from './Calendar/Calendar.svelte';
	import { currentFile } from '@/api/apiStore';
	import { getCollaborationUrl } from '@/utils';

	currentFile.set(null);
	answer.set(null);
</script>

<svelte:head>
	<title>Dashboard | Akademia</title>
</svelte:head>

<ActiveFiles />
<Calendar />
<slot />
