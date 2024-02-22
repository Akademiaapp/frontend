import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';

import MetaSettings from './MetaSettings.svelte';

export const SvelteCounterExtension = Node.create({
	name: 'svelteCounterComponent',
	group: 'block',
	atom: true,
	draggable: true, // Optional: to make the node draggable
	inline: false,

	parseHTML() {
		return [{ tag: 'svelte-counter-component' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['svelte-counter-component', mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return SvelteNodeViewRenderer(MetaSettings);
	}
});