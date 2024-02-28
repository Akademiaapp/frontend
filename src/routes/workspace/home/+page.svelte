<script>
	import ActiveFiles from './activeFiles/ActiveFiles.svelte';
	import Workspace from './../Workspace.svelte';
	import Calendar from './Calendar/Calendar.svelte';
	import { currentFile } from '../../store';

	currentFile.set(null);
</script>

<svelte:head>
	<title>Dashboard | Akademia</title>
</svelte:head>

<Workspace>
	<ActiveFiles />
	<Calendar />
</Workspace>
