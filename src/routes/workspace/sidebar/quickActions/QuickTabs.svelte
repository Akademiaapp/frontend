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

	$: if ($currentFile != null && $currentFile instanceof DocumentInfo) {
		currentTab = 'files';
	}

	export let onClose = () => {};

	$: console.log(currentTab);

	let isAssignment = false;

	$: isAssignment = $currentFile instanceof AssignmentAnswer;
</script>

<div
	class="flex items-center px-3 py-3 pb-2.5"
	class:gap-3={$currentFile instanceof AssignmentAnswer}
>
	<QuickTab
		action={() => switchTab('files')}
		tooltip="Filer"
		active={currentTab == 'files' &&
			($currentFile instanceof AssignmentAnswer ||
				($currentFile instanceof Assignment && $currentFile.isPublic))}
	>
		<Folder size="27"></Folder>
	</QuickTab>
	{#if $currentFile instanceof AssignmentAnswer}
		<QuickTab
			action={() => switchTab('assignment')}
			active={currentTab == 'assignment'}
			tooltip="opgave"
		>
			<ClipboardList size="27"></ClipboardList>
		</QuickTab>
	{/if}
	{#if $currentFile instanceof AssignmentAnswer || ($currentFile instanceof Assignment && $currentFile.isPublic && $answer)}
		<QuickTab action={() => switchTab('chat')} active={currentTab == 'chat'} tooltip="Feedback">
			<MessagesSquare size="27"></MessagesSquare>
		</QuickTab>
	{:else}
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
