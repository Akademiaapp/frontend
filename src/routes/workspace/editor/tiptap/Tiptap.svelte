<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor, EditorContent } from 'svelte-tiptap';

	import { editor, answer } from '../editorStore';
	import { currentFile, currentStatus } from '@/api/apiStore';
	import { FileInfo, Assignment, AssignmentAnswer, AssignmentStatus, DocumentInfo } from '@/api/fileClasses';
	import getExtensions from './getExtensions';

	import { SupabaseProvider } from '@/supabase/supabaseProvider';
	import { supabase } from '@/supabase/supabaseClient';

	import * as Y from 'yjs';
	import type { Tables } from '@/supabase.types';

	let provider: SupabaseProvider;

	$: if ($currentFile) initializeTiptap($currentFile);
	$: if ($answer) initializeTiptap(null);

	// this is needed
	let currentFileName = '';
	$: currentFileName = $currentFile?.name || '';

	export let connected = false;

	let editable = true;
	$: if (
		($currentFile instanceof AssignmentAnswer &&
			$currentFile.status === AssignmentStatus.SUBMITTED) ||
		($currentFile instanceof AssignmentAnswer && $currentFile.status === AssignmentStatus.GRADED) ||
		($currentFile instanceof Assignment && $currentFile.isPublic) ||
		$answer
	)
		editable = false;

	function initializeTiptap(initcurrentFile: Tables<'assignment' | 'assignment_answer' | 'document'> | null) {
		if (!initcurrentFile && !$answer) {
			return;
		}
		let fileName = $answer
			? $answer
			: initcurrentFile.id;
		if (!fileName) {
			return;
		}
		connected = false;

		$editor?.destroy();
		provider?.destroy();

		const document = new Y.Doc();

		provider = new SupabaseProvider(supabase, {
			name: fileName,
			databaseDetails: {
				schema: 'public',
				table: 'document',
				updateColumns: {
					name: 'id',
					content: 'content',
				},
				conflictColumns: 'id',
			},
			document: document,
		});
		connected = true;

		editor.set(
			new Editor({
				extensions: getExtensions(provider, $currentFile instanceof Assignment && !$answer),
				editable: editable,
				onCreate: ({ editor }) => {
					editor.view.dom.setAttribute("spellcheck", "false");
					editor.view.dom.setAttribute("autocomplete", "off");
					editor.view.dom.setAttribute("autocapitalize", "off");
				},
				onUpdate: ({ transaction }) => {
					if (!transaction.isGeneric) return;

					if (
						$currentFile instanceof AssignmentAnswer &&
						$currentStatus !== AssignmentStatus.IN_PROGRESS
					) {
						currentStatus.set(AssignmentStatus.IN_PROGRESS);
					}

					const title: string =
						transaction.doc.content.content[0].content.content[0]?.text || 'Uden titel';
					if (title && title !== currentFileName) {
						$currentFile instanceof FileInfo && $currentFile.rename(title);

						currentFileName = title;
						if ($currentFile != null) {
							const newState: Tables<'assignment' | 'assignment_answer' | 'document'> =
								$currentFile;
							newState.name = title;
							const id = newState.id;
							// Update the value for the specified key
							$currentFile.store.update((prev: FileInfo[]): FileInfo[] => {
								return prev.map((it) => {
									if (it.id == id) return newState;
									return it;
								});
							});
						}
					}

					// if (transaction.isGeneric) {
					// 	const steps = transaction.steps;

					// 	if (steps.length != 1) {
					// 		return;
					// 	}
					// 	const typedLetter: string = steps[0].slice?.content?.content[0]?.text;
					// 	if (!typedLetter) return false;

					// 	const regex = /^[a-z]$/;

					// 	if (!regex.test(typedLetter)) return;

					// 	if (typedLetter === undefined) return;

					// 	const letterBefore = transaction.doc.textBetween(
					// 		transaction.selection.anchor - 3,
					// 		transaction.selection.anchor - 1
					// 	);

					// 	if (letterBefore == '' || letterBefore[0] == '.') {
					// 		$editor.commands.undo();
					// 		$editor.commands.insertContent(typedLetter.toUpperCase());
					// 	}
					// }
				}
			})
		);
	}

	onMount(() => {
		initializeTiptap($currentFile);
	});

	onDestroy(() => {
		$editor?.destroy();
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/mathlive/dist/mathlive-static.css" />
</svelte:head>

<EditorContent editor={$editor} />

<style lang="scss">
	:global(.page > div) {
		height: 100%;
	}

	:global(.tiptap) {
		height: 100%;
	}

	:global(.tiptap h1.is-empty::before) {
		color: #adb5bd;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}

	:global() :global(.ProseMirror:focus) {
		outline: none;
	}

	/* Give a remote user a caret */
	:global(.collaboration-cursor__caret) {
		border-left: 1px solid #0d0d0d;
		border-right: 1px solid #0d0d0d;
		margin-left: -1px;
		margin-right: -1px;
		pointer-events: none;
		position: relative;
		word-break: normal;
	}

	/* Render the username above the caret */
	:global(.collaboration-cursor__label) {
		border-radius: 3px 3px 3px 0;
		color: #0d0d0d;
		font-size: 12px;
		font-style: normal;
		font-weight: 600;
		left: -1px;
		line-height: normal;
		padding: 0.1rem 0.3rem;
		position: absolute;
		top: -1.4em;
		user-select: none;
		white-space: nowrap;
	}
</style>
