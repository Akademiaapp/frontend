<script lang="ts">
	import FileViewer from './main/fileViewer/FileViewer.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import QuickTabs from './quickActions/QuickTabs.svelte';
	import QuickBar from './quickActions/QuickBar.svelte';
	import AssignmentTab from './main/assignment/AssignmentTab.svelte';

	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import Timer from './Timer.svelte';
	import { currentFile } from '@/api/apiStore';
	import { answer } from '../editor/editorStore';
	import ChatTab from './main/chat/ChatTab.svelte';
	export let isExpanded: boolean;

	let isTimerVisible: boolean;

	let hasAssignmentDescription = false;

	$: hasAssignmentDescription = $currentFile ? 
		'feedback_id' in $currentFile ||
		('due_date' in $currentFile && $answer !== null) : false;

	export let currentTab;
	$: currentTab = hasAssignmentDescription ? 'assignment' : 'files';
</script>

<div class="cont br-2 float-panel">
	<div class="top">
		<UserAvatar name />
		<div class="flex gap-2" id="quick-bar">
			<QuickBar bind:isTimerVisible></QuickBar>
		</div>
	</div>
</div>
<div class="br-2 float-panel flex flex-grow flex-col overflow-y-hidden bg-background">
	<QuickTabs bind:currentTab onClose={() => (isExpanded = false)} />
	<Separator></Separator>
	<AssignmentTab isAssignmentDescriptionOpen={currentTab == 'assignment'} />
	{#if currentTab == 'files'}
		<FileViewer />
	{:else if currentTab == 'chat' && ('feedback_id' in $currentFile || ('due_date' in $currentFile && $currentFile.is_public))}
		<ChatTab />
	{/if}
</div>
<Timer bind:visible={isTimerVisible}></Timer>

<style lang="scss">
	.cont {
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.5rem 1rem;
		flex-direction: column;
		background-color: var(--color-bg-1);
	}

	.top {
		display: flex;

		align-items: center;

		justify-content: space-between;
	}
</style>
