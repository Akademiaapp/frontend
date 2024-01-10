<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import Tiptap from './Tiptap.svelte';

	export let tiptap: Editor;

	Tiptap;

	export let activeFile: String;

	// hook on update if we change document
	$: activeFile && tiptap?.on('update', updateHeadings);

	onMount(() => {
		updateHeadings();
		console.log('hdehdhd');
	});

	// Eat some cerial (:
	function cerial(str: String): string {
		return str.replaceAll('?', '').replaceAll(' ', '-');
	}

	type HeadTypes = { text: String; id: String };

	function updateHeadings(): HeadTypes[] {
		if (tiptap === undefined) return [];
		const headings: HeadTypes[] = [];
		const transaction = tiptap.state.tr;
		tiptap.state.doc.descendants((node, pos) => {
			if (node.type.name === 'heading' && node.attrs.level === 1) {
				const id = `${encodeURIComponent(cerial(node.textContent)) + headings.length + 1}`;

				if (node.attrs.id !== id) {
					transaction.setNodeMarkup(pos, undefined, {
						...node.attrs,
						id
					});
				}
				headings.push({ text: node.textContent, id: id });
			}
		});

		transaction.setMeta('addToHistory', false);
		transaction.setMeta('preventUpdate', true);
		tiptap.view.dispatch(transaction);

		topHeadings = headings;
		return headings;
	}

	let topHeadings: HeadTypes[] = [];
</script>

<div class="container">
	{#each topHeadings as h}
		<a href="#{h.id}" class="reset">{h.text}</a>
	{/each}
</div>

<style lang="scss">
	.container {
		position: fixed;
		left: calc(50% + 450px);

		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		a {
			cursor: pointer;

			color: var(--color-text-2);
		}
	}
</style>
