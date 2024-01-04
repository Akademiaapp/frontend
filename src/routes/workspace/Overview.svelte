<script lang="ts">
	import type { Editor } from '@tiptap/core';

	export let tiptap: Editor;

	$: {
		topHeadings = getHeadings(tiptap);
	}

	type HeadTypes = { text: String; id: String };

	function getHeadings(tiptap: Editor): HeadTypes[] {
		if (tiptap === undefined) return [];
		const headings: HeadTypes[] = [];
		const transaction = tiptap.state.tr;
		tiptap.state.doc.descendants((node, pos) => {
			if (node.type.name === 'heading' && node.attrs.level === 1) {
				const id = `heading-${headings.length + 1}`;

				if (node.attrs.id !== id) {
					transaction.setNodeMarkup(pos, undefined, {
						...node.attrs,
						id: 'd'
					});
				}
				headings.push({ text: node.textContent, id: id });
			}
		});

		return headings;
	}

	let topHeadings: HeadTypes[];
</script>

<div class="container">
	{#each topHeadings as h}
		<a href="#${h.id}" class="reset">{h.text}</a>
	{/each}
</div>

<style lang="scss">
	.container {
		position: fixed;
		left: calc(50% + 450px);
		a {
			cursor: pointer;
		}
	}
</style>
