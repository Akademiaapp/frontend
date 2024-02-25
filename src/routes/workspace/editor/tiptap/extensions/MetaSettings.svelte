<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import { NodeViewWrapper } from 'svelte-tiptap';
</script>

<NodeViewWrapper>
	<div class="cont grid">
		<p>Afleveringsfrist</p>
		<p>hello</p>
		<p>hi</p>
		<p>hello</p>
		<p>hi</p>
		<p>hello</p>
		<p>hi</p>
		<p>hello</p>
	</div>
</NodeViewWrapper>

<style>
	.cont {
		grid-template-columns: auto 1fr;
		column-gap: 1rem;
	}

	.cont p {
		font-weight: 500;
		color: var(--color-text-1-t);
	}
</style>
