<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	export let node: NodeViewProps['node'];
	export let updateAttributes: NodeViewProps['updateAttributes'];
	export let editor: NodeViewProps['editor'];

	export let getPos: NodeViewProps['getPos'];
	import MathBox from '@/components/MathBox.svelte';
	import { NodeViewContent, NodeViewWrapper } from 'svelte-tiptap';

	let value;

	let startVal = node.attrs.count;

	$: try {
		updateAttributes({ count: value });
	} catch (e) {
		console.error(e);
	}
</script>

<NodeViewWrapper as="span">
	<button
		class="inline-flex"
		on:focus={() => console.log('focus')}
		on:click={() => {
			console.log(getPos());
			editor.commands.setNodeSelection(getPos());
		}}
	>
		<MathBox bind:value>
			{startVal}
		</MathBox>
	</button>
</NodeViewWrapper>

<style>
	span {
		color: red;
	}
</style>
