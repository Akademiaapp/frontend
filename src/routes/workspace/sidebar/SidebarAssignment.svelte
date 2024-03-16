<script lang="ts">
	import QuickBar from '../quickActions/QuickBar.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import { Editor, EditorContent } from 'svelte-tiptap';
	import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { EditorExtensions } from '@/editor/extensions';
	import Document from '@tiptap/extension-document';
	import { Title } from '../editor/tiptap/extensions/title';
	import ApiHandler from '@/api';
	export let sidebarVisible: boolean = true;

	const api = getContext('api') as ApiHandler;

	let state: AuthorizerState;

	const store = getContext('authorizerContext') as Readable<AuthorizerState>;

	store.subscribe((data: AuthorizerState) => {
		state = data;
		console.log('hahaahhaaggag 	', state);
	});

	export let assignmentId: string = '26e29956-af96-4b22-b088-2a0d5d1474ad';
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
		<div class="assignment-tiptap">
			<h1>Summum jus, summa injura - Analyse</h1>
			<p>I denne time vil vi analysere billedet "Summum jus, summa injura"</p>
			<p>
				<strong
					><em
						>Erik Henningsens 'Summum jus, summa injuria. Barnemordet' fra<span
							class="collaboration-cursor__caret ProseMirror-widget"
							style="border-color: #678c6b"
							contenteditable="false"
							><div class="collaboration-cursor__label" style="background-color: #678c6b">
								dbtracker.dk@gmail.com
							</div></span
						> 1889</em
					></strong
				>
			</p>
			<img
				src="https://www.hirschsprung.dk/storage/representations/proxy/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaGtCIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--c5ad5e056c3779faa020f14beb037772e00fc75a/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2RTNKbGMybDZaVjkwYjE5bWFXeHNXd2RwQXRBSGFRSXpCQT09IiwiZXhwIjpudWxsLCJwdXIiOiJ2YXJpYXRpb24ifX0=--918b982eee23d4bacc9db46fa526b6f6b97abd53/Henningsen-E-154-HBD.jpg"
				contenteditable="false"
				draggable="true"
				class="ProseMirror-selectednode"
			/>
			<ol>
				<li>
					<p>Hvad mon titlen betyder? Spørg Google.&nbsp;</p>
					<p>Hvad mener du om titlen?</p>
				</li>
				<li>
					<p>
						Kig på maleriet igen, hvad tror du, der er sket? Brug din viden om tiden fra dine noter.
					</p>
				</li>
				<li><p><br class="ProseMirror-trailingBreak" /></p></li>
			</ol>
		</div>
	</div>
</nav>

<style lang="scss">
	.assignment-tiptap ol {
		list-style-type: decimal;
		padding: revert;
		margin: revert;
	}
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
