<script lang="ts">
	import Assignment from './../../home/activeFiles/Assignment.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { Editor, EditorContent } from 'svelte-tiptap';

	import Collaboration from '@tiptap/extension-collaboration';
	import { EditorExtensions } from '$lib/editor/extensions';
	import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
	import { HocuspocusProvider } from '@hocuspocus/provider';
	import { goto } from '$app/navigation';
	import TableOfContents from '../../TableOfContents';
	import Document from '@tiptap/extension-document';
	import Placeholder from '@tiptap/extension-placeholder';
	import { Title } from './extensions/title';
	import { editor } from '../editorStore';
	import { FileInfo, currentFile, documentStore } from '@/api/apiStore';
	import { keycloakState, keycloakUserInfo } from '../../../../authStore';
	import { MathExtension } from './extensions/MathExtension';
	import { MetaSettingsExtension } from './extensions/MetaSettingsExtension';
	import getExtensions from './getExtensions';

	let provider: HocuspocusProvider;

	$: if ($currentFile) initializeTiptap($currentFile);

	// this is needed
	let currentFileName = '';
	$: currentFileName = $currentFile?.name || '';

	export let connected = false;

	// $: console.log('token: ', $keycloakState.token);

	function initializeTiptap(initcurrentFile: FileInfo | null) {
		if (!initcurrentFile) {
			return;
		}
		connected = false;
		console.log('Initializing tiptap', initcurrentFile);
		if ($editor) {
			$editor.destroy();
		}
		if (provider) {
			provider.destroy();
		}
		provider = new HocuspocusProvider({
			url: 'wss://collaboration.akademia.cc',
			token: 'Bearer ' + $keycloakState.token,
			name: initcurrentFile.id,
			onAuthenticationFailed: () => {
				$editor.destroy();
				provider.destroy();
				throw new Error('Authentication failed');
				// goto('/workspace/home');
			},
			onConnect: () => {
				if ($editor) {
					$editor.destroy();
				}
				connected = true;

				editor.set(
					new Editor({
						extensions: getExtensions(provider),
						onUpdate: ({ transaction }) => {
							// console.log('too', transaction);
							if (!transaction.isGeneric) return;

							const title: string =
								transaction.doc.content.content[0].content.content[0]?.text || 'Uden titel';
							if (title && title !== currentFileName) {
								$currentFile instanceof FileInfo && $currentFile.rename(title);

								currentFileName = title;
								if ($currentFile != null) {
									const newState: FileInfo = $currentFile;
									newState.name = title;
									const id = newState.id;
									// Update the value for the specified key
									documentStore.update((prev: FileInfo[]): FileInfo[] => {
										return prev.map((it) => {
											if (it.id == id) return newState;
											return it;
										});
									});
								}
							}

							if (transaction.isGeneric) {
								const steps = transaction.steps;

								if (steps.length != 1) {
									return;
								}
								const typedLetter: string = steps[0].slice?.content?.content[0]?.text;
								if (!typedLetter) return false;

								const regex = /^[a-z]$/;

								if (!regex.test(typedLetter)) return;

								if (typedLetter === undefined) return;

								const letterBefore = transaction.doc.textBetween(
									transaction.selection.anchor - 3,
									transaction.selection.anchor - 1
								);

								if (letterBefore == '' || letterBefore[0] == '.') {
									$editor.commands.undo();
									$editor.commands.insertContent(typedLetter.toUpperCase());
								}
							}
						}
					})
				);
			}
		});
	}

	onMount(() => {
		initializeTiptap($currentFile);
	});

	onDestroy(() => {
		if ($editor) {
			$editor.destroy();
		}
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/mathlive/dist/mathlive-static.css" />
</svelte:head>

<EditorContent editor={$editor} />

<style lang="scss">
	.editor_content {
		overflow-wrap: break-word;
		margin-top: 1rem;

		max-width: 100%;
	}

	:global(.page > div) {
		height: 100%;
	}

	:global(.tiptap) {
		height: 100%;
	}

	button.active {
		background: rgb(0, 0, 0);
		color: white;
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

	#editor {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0rem 4rem;
	}

	#text-editor {
		flex: 1;
		display: flex;
	}

	#text-editor :global(.tiptap) {
		flex: 1;
	}
</style>
