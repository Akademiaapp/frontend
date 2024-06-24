import { EditorExtensions } from '@/editor/extensions';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import TableOfContents from '../../TableOfContents';
import { Title } from './extensions/title';
import Placeholder from '@tiptap/extension-placeholder';
import { MathExtension } from './extensions/MathExtension';
import { MetaSettingsExtension } from './extensions/MetaSettingsExtension';
import { get } from 'svelte/store';
import Document from '@tiptap/extension-document';
import { FontSize } from './extensions/FontSize';
import { userInfo } from '../../../store';

export default function getExtensions(provider = null, isAssignment = false) {
	return [
		...EditorExtensions,
		...(provider ? getCollabExtensions(provider) : []),
		Document.extend({
			content: isAssignment ? 'title metaSettings block+' : 'title block+'
		}),
		TableOfContents,
		Title,
		Placeholder.configure({
			placeholder: ({ node }) => {
				if (node.type.name === 'title') {
					return 'Uden titel';
				}

				return '';
			},
			showOnlyCurrent: false
		}),
		MathExtension,
		isAssignment ? MetaSettingsExtension : null,
		FontSize
	];
}

function getCollabExtensions(provider) {
	return [
		CollaborationCursor.configure({
			provider: provider,
			user: {
				name: get(userInfo).username,
				color: `hsla(${~~(360 * Math.random())}, 70%,  72%, 0.8)`
			}
		}),
		Collaboration.configure({
			document: provider.document
		})
	];
}
