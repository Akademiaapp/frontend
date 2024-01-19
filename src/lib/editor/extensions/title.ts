/* eslint-disable @typescript-eslint/no-explicit-any */
import { mergeAttributes, Node } from '@tiptap/core'

export interface TitleOptions {
  HTMLAttributes: Record<string, any>,
	activeFile: string,
	activeFilename: string,
	api: any,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    title: {
      /**
       * Set a title node
       */
      setTitle: (attributes: object) => ReturnType,
    }
  }
}

export const Title = Node.create<TitleOptions>({
	priority: 10,

	marks: '',
	defining: true,
	name: 'title',

  addOptions() {
    return {
			activeFile: '',
			activeFilename: '',
			api: {},
      HTMLAttributes: {},
    }
  },

  group: 'title',
	content: 'text*',

	onUpdate: (yoo) => {
		console.log("too", yoo)
		const title = transaction.doc.content.content[0].content.content[0]?.text;
		if (title && title !== activeFilename) {
			api.renameDocument(activeFile, transaction.doc.content.content[0].content.content[0].text);
		}
	},

  parseHTML() {
    return [{
      tag: `h1`,
      attrs: {  },
    }]
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderHTML({ node, HTMLAttributes }) {
    return [`h1`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: 'title' }), 0]
  },

  addCommands() {
    return {
      setTitle: attributes => ({ commands }) => {
        return commands.setNode(this.name, attributes)
      },
    }
  },
})