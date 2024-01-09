// @ts-nocheck
import { Extension } from '@tiptap/core';

export default Extension.create({
	addGlobalAttributes() {
		return [
			{
				types: ['heading'],
				attributes: {
					id: {
						default: 'hi'
					}
				}
			}
		];
	}
});
