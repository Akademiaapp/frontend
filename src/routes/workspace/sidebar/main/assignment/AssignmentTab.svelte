<script lang="ts">
	import getExtensions from '../../../editor/tiptap/getExtensions';
	import api from '@/api';
	import { Editor, EditorContent } from 'svelte-tiptap';
	import { TiptapTransformer } from '@hocuspocus/transformer';
	import * as Y from 'yjs';
	import { currentFile } from '@/api/apiStore';
	import { AssignmentAnswer, Assignment } from '@/api/fileClasses';

	let assignmentId: string;
	$: assignmentId =
		$currentFile instanceof AssignmentAnswer
			? $currentFile.assignment_id
			: $currentFile instanceof Assignment
				? $currentFile.id
				: '';

	async function getDescription() {
		const res = await api.callApi(`/assignments/${assignmentId}`, null, 'GET');
		const json = await res.json();
		return json.data;
	}

	export let isAssignmentDescriptionOpen: boolean;
	let editor: Editor;

	async function init () {
		if (editor) editor.destroy();
		// Wait for the assignmentId to be set
		while (!assignmentId) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		const data = await getDescription();
		if (!data.data) return;
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
	};
	
	$: if (assignmentId) init();
</script>

<div
	class="settings assignment br-2 float-panel sidebar-scroll flex max-w-[40rem] flex-1 overflow-scroll"
	class:hidden={!isAssignmentDescriptionOpen}
>
	<div class="assignment-tiptap mt-[-4rem]">
		{#if editor}
			<EditorContent bind:editor />
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
</div>

<style lang="scss">
	.assignment-tiptap ol {
		list-style-type: decimal;
		padding: revert;
		margin: revert;
	}
	.settings {
		padding: 2.5rem;
		flex-direction: column;
		background-color: var(--color-bg-1);
	}
</style>
