import type { ClientFile } from './apiStore';

export class Folder {
	name: string;
	subFolders: Folder[];
	files: ClientFile[];
	emoji: string = '';

	constructor(info: { name: string; subFolders: Folder[]; files: ClientFile[]; emoji?: string }) {
		this.name = info.name;
		this.subFolders = info.subFolders;
		this.files = info.files;
		if (info.emoji) {
			this.emoji = info.emoji;
		}
	}
}
