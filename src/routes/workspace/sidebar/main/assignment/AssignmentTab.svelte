<script lang="ts">
	import getExtensions from '../../../editor/tiptap/getExtensions';
	import { Editor, EditorContent } from 'svelte-tiptap';
	import { TiptapTransformer } from '@hocuspocus/transformer';
	import * as Y from 'yjs';
	import { currentFile } from '@/api/apiStore';
	import { assignments } from '@/supabase/supabaseClient';

	let assignmentId: string;
	$: assignmentId = $currentFile ?
		'assignment_id' in $currentFile
			? $currentFile.assignment_id
			: 'due_date' in $currentFile
				? $currentFile.id
				: '' : '';

	async function getDescription() {
		return assignments.find(assignmentId, 'id');
	}

	export let isAssignmentDescriptionOpen: boolean;
	let editor: Editor;

	async function init() {
		editor?.destroy();
		// Wait for the assignmentId to be set
		while (!assignmentId) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		const data = await getDescription();
		if (!data) return;
		const ydoc = new Y.Doc();
		Y.applyUpdate(ydoc, new Uint8Array(data.content)); // TODO: Check if this is the correct way to apply the update
		const doc = TiptapTransformer.extensions(getExtensions(null, true)).fromYdoc(ydoc);
		// Remove metaSettings node from ydoc
		doc.default.content.splice(1, 1);

		editor = new Editor({
			extensions: getExtensions(null, false),
			content: doc.default,
			editable: false
		});
	}

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
