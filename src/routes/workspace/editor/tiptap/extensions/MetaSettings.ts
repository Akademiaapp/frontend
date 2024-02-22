import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';

import MetaSettings from './MetaSettings.svelte';

export const MetaSettingsExtension = Node.create({
	name: 'metaSettingComponement',
	group: 'block',
	atom: true,
	draggable: true, // Optional: to make the node draggable
	inline: false,

	parseHTML() {
		return [{ tag: 'meta-setting-componement' }];
	},

	renderHTML({ HTMLAttributes }) {
		return ['meta-setting-componement', mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return SvelteNodeViewRenderer(MetaSettings);
	}
});
