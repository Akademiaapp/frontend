<script lang="ts">
	import { goto } from '$app/navigation';
	import SearchQ from './SearchQ.svelte';
	import QuickAction from './QuickAction.svelte';
	import { page } from '$app/stores';
	import { ChevronLeft, ClipboardList, Folder, MessagesSquare } from 'lucide-svelte';
	import QuickTab from './QuickTab.svelte';
	import { currentFile } from '@/api/apiStore';
	import { AssignmentAnswer, Assignment, DocumentInfo } from '@/api/fileClasses';
	import { answer } from '../../editor/editorStore';

	export let currentTab = 'files';

	function switchTab(tab) {
		currentTab = tab;
	}

	export let onClose = () => {};

	$: console.log(currentTab);

	let showAssignmentTabs = false;
	$: showAssignmentTabs =
		$currentFile instanceof AssignmentAnswer ||
		($currentFile instanceof Assignment && $currentFile.isPublic);
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
	{/if}
	{#if $answer || $currentFile instanceof AssignmentAnswer}
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
