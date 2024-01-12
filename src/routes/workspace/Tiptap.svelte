<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import Collaboration from '@tiptap/extension-collaboration';
	import { EditorExtensions } from '$lib/editor/extensions';
	import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
	import * as Y from 'yjs';
	import { HocuspocusProvider } from '@hocuspocus/provider';
	import { getContext } from 'svelte';
	import type { AuthorizerState } from '@authorizerdev/authorizer-svelte/types';
	import type { Readable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import TableOfContents from './TableOfContents';
	import Heading from '@tiptap/extension-heading';
	import ApiHandler from '$lib/api';
	import Document from '@tiptap/extension-document';

	let state: AuthorizerState;

	const api = new ApiHandler(<Readable<AuthorizerState>>getContext('authorizerContext'));

	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
		console.log(state);
	});

	let element: Element;

	export let editor: Editor;
	export let activeFile: string;
	export let activeFilename: string;

	$: activeFile && initializeTiptap(activeFile);

	function initializeTiptap(activeFile: string) {
		console.log('Initializing tiptap', activeFile);
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
		if (editor) {
			editor.destroy();
		}
		if (state.token == null) {
			goto('/signin');
			return;
		}
		const provider = new HocuspocusProvider({
			url: 'wss://backend.akademia.cc',
			token: state.token.access_token,
			name: activeFile,
			onAuthenticationFailed: () => {
				editor.destroy();
				element.innerHTML =
					'Authentication failed! You do not have access to this document!! 🚫⚠️❌⚠️🚫';
				throw new Error('Authentication failed');
			},
			onConnect: () => {
				editor = new Editor({
					element: element,
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
							document: provider.document,
						}),
						Document.extend({
							content: 'title block+'
						}),
						TableOfContents,
						Heading.extend({
							name: 'title',
							defaultOptions: {
								HTMLAttributes: {
									class: 'title'
								}
							},
							onUpdate: ({ transaction }) => {
								api.renameDocument(
									activeFile,
									transaction.doc.content.content[0].content.content[0].text
								);
							}
						})
					],
					content: `<title>${activeFilename}</title>`,

					onUpdate: () => {
						editor = editor;
					}
				});
			}
		});
	}

	onMount(() => {
		initializeTiptap(activeFile);
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div id="text-editor" class="editor_content" bind:this={element} />

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

	:global(.ProseMirror:focus) {
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
