<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	export let node: NodeViewProps['node'];
	export let updateAttributes: NodeViewProps['updateAttributes'];
	export let editor: NodeViewProps['editor'];

	export let getPos: NodeViewProps['getPos'];
	import MathBox from '@/components/MathBox.svelte';
	import { NodeViewWrapper } from 'svelte-tiptap';

	let value;

	let startVal = node.attrs.count;

	$: try {
		updateAttributes({ count: value });
	} catch (e) {
		console.error(e);
	}

	function focus() {
		editor.commands.setNodeSelection(getPos());
	}
</script>

<NodeViewWrapper as="span">
	<MathBox bind:value onFocus={focus} expression={node.attrs.count}>
		{startVal}
	</MathBox>
</NodeViewWrapper>
