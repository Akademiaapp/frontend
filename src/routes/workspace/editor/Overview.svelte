<script lang="ts">
	import { editor } from './editorStore';

	// hook on update if we change document
	$: $editor?.on('update', updateHeadings);

	// Eat some cerial (:
	function cerial(str: string): string {
		return str.replaceAll('?', '').replaceAll(' ', '-');
	}

	type HeadTypes = { text: string; level: number; id: string };

	function updateHeadings(): HeadTypes[] {
		if ($editor === undefined) return [];
		const headings: HeadTypes[] = [];
		const transaction = $editor.state.tr;
		$editor.state.doc.descendants((node, pos) => {
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
		$editor.view.dispatch(transaction);

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

<div class="cont">
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

	.cont {
		position: sticky;
		top: calc(var(--pad) + 2.5rem);
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

	// Hide cont on smaller screens
	@media (max-width: 1500px) {
		.cont {
			display: none;
		}
	}
</style>
