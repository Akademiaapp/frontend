<script>
	import ActiveFiles from './activeFiles/ActiveFiles.svelte';
	import Calendar from './Calendar/Calendar.svelte';
	import { currentFile } from '@/api/apiStore';
	import { getCollaborationUrl } from '@/utils';

	currentFile.set(null);

	console.log("url: ", getCollaborationUrl());
</script>

<svelte:head>
	<title>Dashboard | Akademia</title>
</svelte:head>

<ActiveFiles />
<Calendar />
<slot />
