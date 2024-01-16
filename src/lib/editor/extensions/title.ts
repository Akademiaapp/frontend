import Heading from '@tiptap/extension-heading';

export const title = Heading.extend({
	priority: 10,
	name: 'title',
	onUpdate: ({ transaction }) => {
		const title = transaction.doc.content.content[0].content.content[0]?.text;
		if (title && title !== activeFilename) {
			api.renameDocument(activeFile, transaction.doc.content.content[0].content.content[0].text);
		}
	}
}).configure({
	HTMLAttributes: {
		class: 'my-custom-class'
	}
});
