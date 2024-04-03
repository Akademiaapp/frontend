<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import QuickTabs from './quickActions/QuickTabs.svelte';
	import QuickBar from './quickActions/QuickBar.svelte';
	import SidebarAssignment from './SidebarAssignment.svelte';
	import FileViewer from './FileViewer.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import Timer from './Timer.svelte';
	import { AssignmentAnswer, currentFile } from '@/api/apiStore';
	import { editor } from '../editor/editorStore';
	export let isExpanded: boolean;

	let isTimerVisible: boolean;

	let hasAssignmentDescription = false;

	$: hasAssignmentDescription = $currentFile instanceof AssignmentAnswer;

	$: if (hasAssignmentDescription) currentTab = 'assignment';

	$: console.log($currentFile instanceof AssignmentAnswer);

	export let currentTab;
</script>

<div class="cont br-2 float-panel">
	<div class="top">
		<UserAvatar name />
		<div class="flex gap-2" id="quick-bar">
			<QuickBar bind:isTimerVisible></QuickBar>
		</div>
	</div>
</div>
<div class="br-2 flex flex-grow flex-col overflow-y-hidden bg-background">
	<QuickTabs bind:currentTab onClose={() => (isExpanded = false)} />
	<Separator></Separator>
	<SidebarAssignment isAssignmentDescriptionOpen={currentTab == 'assignment'} />
	{#if currentTab == 'files'}
		<FileViewer />
	{:else if currentTab == 'chat' && $currentFile instanceof AssignmentAnswer}
		<div class="p-5">
			<h1 class="mb-1">Feedback:</h1>
			<h2>Karakter: {$currentFile.grade}</h2>
			<p>{$currentFile.feedback}</p>
		</div>
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

		button {
			span {
				font-size: 2rem;

				transition: rotate 300ms ease;
				vertical-align: middle;
			}

			transition: all 100ms;

			background-color: var(--color-bg-1);

			padding: 0.25rem;

			color: var(--color-text-1);

			border-radius: 8px;

			&:hover {
				color: var(--color-text-0);
			}
		}
	}
</style>
