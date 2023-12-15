<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Collaboration from '@tiptap/extension-collaboration';
	import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
	import * as Y from 'yjs';
	import { HocuspocusProvider } from '@hocuspocus/provider';

	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';

	interface AuthorizerState {
		token: string;
		user: any;
		loading: boolean;
		logout: Function;
		subscribe: Function;
	};

	let state: AuthorizerState;

	const store: AuthorizerState = getContext('authorizerContext');

	
	store.subscribe((data: AuthorizerState) => {
		state = data;
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
		const ydoc = new Y.Doc();
		const provider = new HocuspocusProvider({
			url: 'wss://backend.akademia.cc:8091',
			token: state.token,
			name: activeFile,
			document: ydoc,
			onConnect: () => {
				editor = new Editor({
					element: element,
					extensions: [
						CollaborationCursor.configure({
							provider,
							user: {
								name: 'Test user',
								color: '#f783ac'
							}
						}),
						StarterKit.configure({
							history: false
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

<style>
	.editor_wrapper {
		display: flex;
		flex-direction: column;
		max-width: 100%;
		max-height: 100%;
		padding: 1rem;
		overflow-y: hidden;
	}

	.editor_content {
		min-height: 110%;
		overflow-y: scroll;
		margin-top: 1rem;
		flex: 1;
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
