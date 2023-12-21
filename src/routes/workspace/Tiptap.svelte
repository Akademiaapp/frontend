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

	let state: AuthorizerState;

	const store = <Readable<AuthorizerState>>getContext('authorizerContext');

	store.subscribe((data: AuthorizerState) => {
		state = data;
		console.log(state);
	});

	let element: Element;

	export let editor: Editor;
	export let activeFile: string;
	$: activeFile && initializeTiptap(activeFile);

	function initializeTiptap(activeFile: string) {
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
		const ydoc = new Y.Doc();
		const provider = new HocuspocusProvider({
			url: 'wss://backend.akademia.cc',
			token: state.token.access_token,
			name: activeFile,
			document: ydoc,
			onAuthenticationFailed: () => {
				editor.destroy();
				element.innerHTML = 'Authentication failed! You do not have access to this document!! 🚫⚠️❌⚠️🚫';
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
							document: ydoc
						})
					],
					content: '',
					onTransaction: () => {
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

<div id="editor" class="editor_wrapper">
	<div id="text-editor" class="editor_content" bind:this={element} />
</div>

<style lang="scss">
	.editor_wrapper {
		max-width: 100%;
		max-height: 100%;
		padding: 1rem;
		overflow-y: hidden;
		&:hover,
		:active,
		:focus {
			overflow-y: auto;
			&::-webkit-scrollbar {
				opacity: 1;
			}
		}
		&::-webkit-scrollbar {
			width: 10px;
			opacity: 0;
			background-color: white;
		}

		&::webkit-scrollbar-button {
			display: none;
		}

		/* Track */
		&::-webkit-scrollbar-track {
			// background-color: var(--color-bg-2);
			background-color: transparent;
		}

		/* Handle */
		&::-webkit-scrollbar-thumb {
			border-radius: 100px;
			background-color: var(--color-text-3);
		}

		/* Handle on hover */
		&::-webkit-scrollbar-thumb:hover {
			background: var(--color-text-2);
		}
	}

	.editor_content {
		margin-top: 1rem;
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
