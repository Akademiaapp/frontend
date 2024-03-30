<script lang="ts">
	import QuickBar from '../quickActions/QuickBar.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import { ChevronLeft } from 'lucide-svelte';

	export let sidebarVisible: boolean = true;

	export let assignmentId: string = '26e29956-af96-4b22-b088-2a0d5d1474ad';

	export let isAssignmentDescriptionOpen: boolean;
	// let editor = new Editor({
	// 	extensions: [
	// 		...EditorExtensions,
	// 		Title,
	// 		Document.extend({
	// 			content: 'title block+'
	// 		})
	// 	],
	// 	content: api.getDocumentJson(assignmentId),
	// 	editable: false
	// });
</script>

<div
	class="settings assignment br-2 float-panel sidebar-scroll flex max-w-[40rem] flex-1 overflow-scroll"
	class:hidden={!isAssignmentDescriptionOpen}
>
	<button
		class="flex items-center text-xs hover:underline"
		on:click={() => (isAssignmentDescriptionOpen = false)}
	>
		<ChevronLeft size="15" />
		Tilbage
	</button>
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

<style lang="scss">
	.assignment-tiptap ol {
		list-style-type: decimal;
		padding: revert;
		margin: revert;
	}
	.settings {
		padding: 1rem;
		flex-direction: column;
		background-color: var(--color-bg-1);
	}
</style>
