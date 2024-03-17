import { Editor, Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import MetaSettings from './MetaSettings.svelte';

let editor: Editor;
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
		// editor = this.editor;
		// console.log(transaction);
		// console.log(this.editor);
		// console.log(transaction.curSelection.$anchor.path[1]);
	},
	addProseMirrorPlugins() {
		const editor = this.editor;
		return [
			new Plugin({
				key: new PluginKey('eventHandler'),
				props: {
					handleKeyDown(view, event) {
						const selection = view.state.selection;
						if (event.key === 'Backspace') {
							if (selection.$anchor.pos != view.state.selection.$head.pos) return;
							if (selection.$anchor.parentOffset !== 0) return;
							if (selection.$anchor.path[1] !== 2) return;
							editor
								.chain()
								.deleteCurrentNode()
								.setTextSelection(selection.$anchor.pos - 3)
								.run();
							event.preventDefault();
						} else if (event.key == 'Enter') {
							if (selection.$anchor.path[1] !== 0) return;
							if (selection.$anchor.path[3].content.size + 1 !== selection.$anchor.pos) return;
							editor.commands.setTextSelection(selection.$anchor.pos + 2);
						}
					}
				}
			})
		];
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
