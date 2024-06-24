import type { fileInfo } from '@/supabase/supabaseClient';

export class Folder {
	name: string;
	subFolders: Folder[];
	files: fileInfo[];
	emoji: string = '';

	constructor(info: { name: string; subFolders: Folder[]; files: FileInfo[]; emoji?: string }) {
		this.name = info.name;
		this.subFolders = info.subFolders;
		this.files = info.files;
		if (info.emoji) {
			this.emoji = info.emoji;
		}
	}
}
