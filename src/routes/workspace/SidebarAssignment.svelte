<script lang="ts">
	import QuickBar from './quickActions/QuickBar.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import { Editor, EditorContent } from 'svelte-tiptap';
	import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { EditorExtensions } from '@/editor/extensions';
	import Document from '@tiptap/extension-document';
	import { Title } from './editor/tiptap/extensions/title';
	import ApiHandler from '@/api';
	export let sidebarVisible: boolean;

	const api = getContext('api') as ApiHandler;

	let state: AuthorizerState;

	const store = getContext('authorizerContext') as Readable<AuthorizerState>;

	store.subscribe((data: AuthorizerState) => {
		state = data;
		console.log('hahaahhaaggag 	', state);
	});

	export let assignmentId: string = 'Test';
	let editor = new Editor({
		extensions: [
			...EditorExtensions,
			Title,
			Document.extend({
				content: 'title block+'
			})
		],
		content: api.getDocumentJson(assignmentId),
		editable: false
	});
</script>

<nav class="sideBar" class:hidden={!sidebarVisible}>
	<div class="settings br-2 float-panel">
		<div class="top">
			<UserAvatar name />
			<button
				class="reset"
				on:click={() => {
					sidebarVisible = !sidebarVisible;
				}}
			>
				<span class="material-symbols-rounded icon-w-4">keyboard_double_arrow_left</span>
			</button>
		</div>
		<QuickBar />
	</div>

	<div class="settings assignment br-2 float-panel flex-1 overflow-scroll">
		<EditorContent {editor} />
	</div>
</nav>

<style lang="scss">
	.settings {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1rem;
		flex-direction: column;
		background-color: var(--color-bg-1);
	}

	.sideBar {
		pointer-events: auto;
		resize: horizontal;
		width: 30rem;
		min-width: 10rem;
		max-width: 30rem;
		display: flex;
		gap: 0.75rem;
		flex-direction: column;

		&.hidden {
			button {
				span {
					rotate: 180deg;
				}

				position: sticky;
				left: 10px;

				transform: translate(4.5rem, -1rem);
			}
		}
	}

	.top {
		display: flex;

		align-items: center;

		justify-content: space-between;

		button {
			span {
				font-size: 2rem;

				transition: rotate 300ms ease;
				vertical-align: middle;
			}

			transition: all 100ms;

			background-color: var(--color-bg-1);

			padding: 0.25rem;

			color: var(--color-text-1);

			border-radius: 8px;

			&:hover {
				color: var(--color-text-0);
			}
		}
	}
</style>
