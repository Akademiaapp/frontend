import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';

import MetaSettings from './MetaSettings.svelte';

export const MetaSettingsExtension = Node.create({
	name: 'metaSettings',
	group: 'meta-settings',
	atom: true,
	draggable: true, // Optional: to make the node draggable
	inline: false,

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
