<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor, EditorContent } from 'svelte-tiptap';

	import Collaboration from '@tiptap/extension-collaboration';
	import { EditorExtensions } from '$lib/editor/extensions';
	import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
	import { HocuspocusProvider } from '@hocuspocus/provider';
	import { getContext } from 'svelte';
	import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
	import { type Readable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import TableOfContents from '../TableOfContents';
	import ApiHandler from '$lib/api';
	import Document from '@tiptap/extension-document';
	import Placeholder from '@tiptap/extension-placeholder';
	import { Title } from '$lib/editor/extensions/title';
	import { activeFile } from '../../store';
	import { fileStore, type FileInfo } from '@/api/apiStore';
	import { editor } from './editorStore';

	let state: AuthorizerState;

	const api = getContext('api') as ApiHandler;

	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
		console.log(state);
	});

	let provider: HocuspocusProvider;

	$: if ($activeFile) initializeTiptap($activeFile);

	// this is needed
	let activeFileName = '';
	$: activeFileName = $activeFile?.name || '';

	function initializeTiptap(initActiveFile: FileInfo | null) {
		if (!initActiveFile) {
			return;
		}
		console.log('Initializing tiptap', initActiveFile);
		if ($editor) {
			$editor.destroy();
		}
		if (provider) {
			provider.destroy();
		}
		if (!state.token?.access_token) {
			goto('/signin');
			return;
		}
		provider = new HocuspocusProvider({
			url: 'wss://akademia-backend.arctix.dev',
			token: state.token.access_token,
			name: initActiveFile.id,
			onAuthenticationFailed: () => {
				$editor.destroy();
				provider.destroy();
				goto('/workspace/home');
				throw new Error('Authentication failed');
			},
			onConnect: () => {
				if ($editor) {
					$editor.destroy();
				}
				editor.set(
					new Editor({
						extensions: [
							...EditorExtensions,
							CollaborationCursor.configure({
								provider: provider,
								user: {
									name: state.user?.preferred_username,
									color: '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')
								}
							}),
							Collaboration.configure({
								document: provider.document
							}),
							Document.extend({
								content: 'title block+'
							}),
							TableOfContents,
							Title,
							Placeholder.configure({
								placeholder: ({ node }) => {
									if (node.type.name === 'title') {
										return 'Uden titel';
									}

									return '';
								},
								showOnlyCurrent: false
							})
						],
						onUpdate: ({ transaction }) => {
							// console.log('too', transaction);
							if (!transaction.isGeneric) return;

							const title =
								transaction.doc.content.content[0].content.content[0]?.text || 'Uden titel';
							if (title && title !== activeFileName) {
								api.renameDocument(initActiveFile.id, title);

								activeFileName = title;

								const newState = { ...$activeFile };
								// Update the value for the specified key
								newState['name'] = title;

								fileStore.update((prev) => {
									return prev.map((it) => {
										if (it.id == $activeFile?.id) return newState;
										return it;
									});
								});
							}

							// editor.commands.undo();
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
		initializeTiptap($activeFile);
	});

	onDestroy(() => {
		if ($editor) {
			$editor.destroy();
		}
	});
</script>

<EditorContent editor={$editor} />

<style lang="scss">
	.editor_content {
		overflow-wrap: break-word;
		margin-top: 1rem;

		max-width: 100%;
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

	:global(.title) {
		font-size: 3rem;
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
