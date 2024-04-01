<script lang="ts">
	import { goto } from '$app/navigation';
	import SearchQ from './SearchQ.svelte';
	import QuickAction from './QuickAction.svelte';
	import { page } from '$app/stores';
	import { ChevronLeft, ClipboardList, Folder, MessagesSquare } from 'lucide-svelte';
	import QuickTab from './QuickTab.svelte';

	export let currentTab = 'files';

	function switchTab(tab) {
		currentTab = tab;
	}

	export let onClose = () => {};

	$: console.log(currentTab);
</script>

<div class="flex gap-3 px-3 py-3 pb-2.5">
	<QuickTab action={() => switchTab('files')} active={currentTab == 'files'}>
		<Folder size="27"></Folder>
	</QuickTab>
	<QuickTab action={() => switchTab('assignment')} active={currentTab == 'assignment'}>
		<ClipboardList size="27"></ClipboardList>
	</QuickTab>
	<QuickTab action={() => switchTab('chat')} active={currentTab == 'chat'}>
		<MessagesSquare size="27"></MessagesSquare>
	</QuickTab>
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
