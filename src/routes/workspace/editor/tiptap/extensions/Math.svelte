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

	$: console.log(node.attrs.count);

	$: try {
		updateAttributes({ count: value });
	} catch (e) {
		console.error(e);
	}

	function focus() {
		console.log(getPos());
		setTimeout(() => {
			editor.commands.setNodeSelection(getPos() - 2);
		}, 100);
	}
</script>

<NodeViewWrapper as="span">
	<button class="inline-flex" on:focus={() => console.log('focus')} on:click={focus}>
		<MathBox bind:value onFocus={focus} expression={node.attrs.count}>
			{startVal}
		</MathBox>
	</button>
</NodeViewWrapper>

<style>
	span {
		color: red;
	}
</style>
