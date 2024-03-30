<script lang="ts">
	import QuickBar from '../quickActions/QuickBar.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import { ChevronLeft } from 'lucide-svelte';
	import { EditorExtensions } from '@/editor/extensions';
	import { Title } from '../editor/tiptap/extensions/title';
	import Document from '@tiptap/extension-document';
	import getExtensions from '../editor/tiptap/getExtensions';
	import api from '@/api';
	import { Editor, EditorContent } from 'svelte-tiptap';

	export let sidebarVisible: boolean = true;

	export let assignmentId: string = '410f8d03-e429-4809-ab10-0829ce961796';

	async function getDescription() {
		const res = await api.callApi(`/assignments/${assignmentId}`, null, 'GET');
		const json = await res.json();
		console.log(json);
		return json.data;
	}
	export let isAssignmentDescriptionOpen: boolean;
	let dfgdfg = new Editor({
		extensions: getExtensions(null, false),
		content: getDescription(),
		editable: false
	});
</script>

<div
	class="settings assignment br-2 float-panel sidebar-scroll flex max-w-[40rem] flex-1 overflow-scroll"
	class:hidden={!isAssignmentDescriptionOpen}
>
	<button
		class="flex items-center text-xs hover:underline"
		on:click={() => (isAssignmentDescriptionOpen = false)}
	>
		<ChevronLeft size="15" />
		Tilbage
	</button>
	<div class="assignment-tiptap">
		<EditorContent editor={dfgdfg} />
	</div>
</div>

<style lang="scss">
	.assignment-tiptap ol {
		list-style-type: decimal;
		padding: revert;
		margin: revert;
	}
	.settings {
		padding: 1rem;
		flex-direction: column;
		background-color: var(--color-bg-1);
	}
</style>
