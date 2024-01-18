<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import Tiptap from './Tiptap.svelte';

	export let tiptap: Editor;

	// hook on update if we change document
	$: tiptap && updateHeadings();

	// Eat some cerial (:
	function cerial(str: string): string {
		return str.replaceAll('?', '').replaceAll(' ', '-');
	}

	type HeadTypes = { text: string; level: number; id: string };

	function updateHeadings(): HeadTypes[] {
		if (tiptap === undefined) return [];
		const headings: HeadTypes[] = [];
		const transaction = tiptap.state.tr;
		tiptap.state.doc.descendants((node, pos) => {
			if (node.type.name === 'heading') {
				const id = `${encodeURIComponent(cerial(node.textContent)) + headings.length + 1}`;

				if (node.attrs.id !== id) {
					transaction.setNodeMarkup(pos, undefined, {
						...node.attrs,
						id
					});
				}
				headings.push({ text: node.textContent, level: node.attrs.level, id: id });
			}
		});

		transaction.setMeta('addToHistory', false);
		transaction.setMeta('preventUpdate', true);
		tiptap.view.dispatch(transaction);

		topHeadings = headings;
		return headings;
	}

	let topHeadings: HeadTypes[] = [];

	function higlight(id: string) {
		const elem = document.getElementById(id);

		elem?.classList.add('higlight');
		setTimeout(() => {
			elem?.classList.remove('higlight');
		}, 10000);
	}
</script>

<div class="container">
	{#each topHeadings as h}
		<a
			href="#{h.id}"
			on:click={() => {
				higlight(h.id);
			}}
			class:h1={h.level == 1}
			class="reset">{h.text}</a
		>
	{/each}
</div>

<style lang="scss">
	:global(.higlight:before) {
		color: red;
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		top: 0;
		width: 100%;
		height: 2px;
		background: #000;
		box-shadow: 0 0 5px black;
	}

	.container {
		position: sticky;
		top: var(--pad);
		align-self: flex-start;

		display: flex;
		flex-direction: column;

		padding-left: 1rem;

		width: 0;
		a {
			width: 200px;
			cursor: pointer;

			color: var(--color-text-2);

			&.h1 {
				color: var(--color-text-1);
			}
		}
	}

	// Hide container on smaller screens
	@media (max-width: 1500px) {
		.container {
			display: none;
		}
	}
</style>
