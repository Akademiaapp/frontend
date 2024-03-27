<script>
	import ActiveFiles from './activeFiles/ActiveFiles.svelte';
	import Workspace from '../+layout.svelte';
	import Calendar from './Calendar/Calendar.svelte';
	import { currentFile } from '@/api/apiStore';
	import { getApiUrl } from '@/utils';

	currentFile.set(null);

	console.log("url: ", getApiUrl());
</script>

<svelte:head>
	<title>Dashboard | Akademia</title>
</svelte:head>

<ActiveFiles />
<Calendar />
<slot />
