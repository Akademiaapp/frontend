import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';

import MetaSettings from './MetaSettings.svelte';

export const MetaSettingsExtension = Node.create({
	name: 'metaSettings',
	group: 'block',
	atom: true,

	selectable: false,
	// draggable: true, // Optional: to make the node draggable
	// inline: false,
	// isolating: true,
	// allowGapCursor: true,
	onTransaction: function ({ transaction }) {
		console.log(transaction.curSelection.$anchor.path[1]);
	},

	parseHTML() {
		return [{ tag: 'meta-settings-component' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['meta-settings-component', mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return SvelteNodeViewRenderer(MetaSettings);
	}
});
