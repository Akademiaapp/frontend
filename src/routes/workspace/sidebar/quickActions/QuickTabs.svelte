<script lang="ts">
	import { ChevronLeft, ClipboardList, Folder, MessagesSquare } from 'lucide-svelte';
	import QuickTab from './QuickTab.svelte';
	import { currentFile } from '@/api/apiStore';
	import { answer } from '../../editor/editorStore';

	export let currentTab = 'files';

	function switchTab(tab) {
		currentTab = tab;
	}

	export let onClose = () => {};

	let showAssignmentTabs = false;
	$: showAssignmentTabs = $currentFile ? 'feedback_id' in $currentFile || $answer !== null : false;
</script>

<div class="flex items-center px-3 py-3 pb-2.5" class:gap-3={showAssignmentTabs}>
	<QuickTab
		action={() => switchTab('files')}
		tooltip="Filer"
		active={currentTab == 'files' && showAssignmentTabs}
	>
		<Folder size="27"></Folder>
	</QuickTab>
	{#if showAssignmentTabs}
		<QuickTab
			action={() => switchTab('assignment')}
			active={currentTab == 'assignment'}
			tooltip="opgave"
		>
			<ClipboardList size="27"></ClipboardList>
		</QuickTab>
		<QuickTab action={() => switchTab('chat')} active={currentTab == 'chat'} tooltip="Feedback">
			<MessagesSquare size="27"></MessagesSquare>
		</QuickTab>
	{/if}
	{#if !showAssignmentTabs}
		<p class="text-lg font-semibold">Filer</p>
	{/if}
	<div class="flex-1"></div>
	<button
		class="justify-self-en1 p-1.5 text-muted-foreground hover:text-foreground"
		on:click={onClose}
	>
		<ChevronLeft size="27"></ChevronLeft>
	</button>
</div>

<style lang="scss">
</style>
