<script>
	import ActiveFiles from './activeFiles/ActiveFiles.svelte';
	import Workspace from './../Workspace.svelte';
	import Calender from './Calender/Calender.svelte';
	import { activeFile } from '../../store';

	activeFile.set(null);
</script>

<svelte:head>
	<title>Dashboard | Akademia</title>
</svelte:head>

<Workspace>
	<ActiveFiles></ActiveFiles>
	<Calender></Calender>
</Workspace>
