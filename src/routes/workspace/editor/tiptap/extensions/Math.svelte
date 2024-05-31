<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	export let node: NodeViewProps['node'];
	export let updateAttributes: NodeViewProps['updateAttributes'];
	export let editor: NodeViewProps['editor'];

	export let getPos: NodeViewProps['getPos'];
	import MathBox from '@/components/MathBox.svelte';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { NodeRange } from '@tiptap/pm/model';

	let startVal = node.attrs.count == 0 ? '' : node.attrs.count;
	let value = startVal;

	$: try {
		updateAttributes({ count: value == '' ? 0 : value });
	} catch (e) {
		console.error(e);
	}

	function focus() {
		editor.commands.setNodeSelection(getPos());
	}

	function deleteNode() {
		if (!getPos()) return;
		editor.commands.deleteRange({ from: getPos(), to: getPos() + node.nodeSize });
	}
</script>

<NodeViewWrapper as="span">
	<MathBox bind:value onFocus={focus} onDelete={deleteNode}>
		{startVal}
	</MathBox>
</NodeViewWrapper>
