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
	import { TiptapTransformer } from '@hocuspocus/transformer';
	import { onMount } from 'svelte';
	import * as Y from 'yjs';
	import { AssignmentAnswer, AssignmentProgress, currentFile } from '@/api/apiStore';

	export let assignmentId: string =
		$currentFile instanceof AssignmentAnswer ? $currentFile.assignment_id : null;

	currentFile.subscribe((value) => {
		if (!(value instanceof AssignmentAnswer)) return;
		assignmentId = value.assignment_id;
	});

	async function getDescription() {
		const res = await api.callApi(`/assignments/${assignmentId}`, null, 'GET');
		const json = await res.json();
		console.log(json);
		return json.data;
	}

	export let isAssignmentDescriptionOpen: boolean;
	let editor: Editor;

	onMount(async () => {
		// Wait for the assignmentId to be set
		while (!assignmentId) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		const data = await getDescription();
		console.log('aaaa', typeof data, data, new Uint8Array(data.data));
		const ydoc = new Y.Doc();
		Y.applyUpdate(ydoc, new Uint8Array(data.data));
		const doc = TiptapTransformer.extensions(getExtensions(null, true)).fromYdoc(ydoc);

		// Remove metaSettings node from ydoc
		doc.default.content.splice(1, 2);

		editor = new Editor({
			extensions: getExtensions(null, false),
			content: doc.default,
			editable: false
		});
	});
</script>

<div
	class="settings assignment br-2 float-panel sidebar-scroll flex max-w-[40rem] flex-1 overflow-scroll"
	class:hidden={!isAssignmentDescriptionOpen}
>
	<div class="assignment-tiptap">
		{#if editor}
			<EditorContent bind:editor />
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
	{#if $currentFile instanceof AssignmentAnswer && $currentFile.progress === AssignmentProgress.GRADED}
		<div class="my-4 w-full border-t-[1px] border-gray-400 opacity-60" />
		<div>
			<h2>Karakter: {$currentFile.grade}</h2>
			<h2>Feedback:</h2>
			<p>{$currentFile.feedback}</p>
		</div>
	{/if}
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
