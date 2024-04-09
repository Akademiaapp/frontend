import { FileInfo, Folder } from '@/api/fileClasses';
import { writable } from 'svelte/store';

export const draggingElem = writable(null);
export const isDragging = writable(false);

const testFiles = [
	new FileInfo({
		id: '1',
		name: 'Noget',
		data: '1',
		created: new Date().toDateString(),
		updated: new Date().toDateString()
	}),
	new FileInfo({
		id: '1',
		name: 'ABC',
		data: '1',
		created: new Date().toDateString(),
		updated: new Date().toDateString()
	})
];
export const subjects = [
	new Folder({
		name: 'Dansk',
		emoji: '🇩🇰',
		subFolders: [],
		files: testFiles
	}),
	new Folder({
		name: 'Engelsk',
		emoji: '🇬🇧',
		subFolders: [],
		files: testFiles
	}),
	new Folder({
		name: 'Fransk',
		emoji: '🇫🇷',
		subFolders: [],
		files: testFiles
	}),
	new Folder({
		name: 'Matematik',
		emoji: '📊',
		subFolders: [],
		files: testFiles
	}),
	new Folder({
		name: 'Fysik/Kemi',
		emoji: '⚛️',
		subFolders: [],
		files: testFiles
	}),
	new Folder({
		name: 'Biologi',
		emoji: '🌱',
		subFolders: [],
		files: testFiles
	}),
	new Folder({
		name: 'Historie',
		emoji: '🏛️',
		subFolders: [],
		files: testFiles
	}),
	new Folder({
		name: 'Samfundsfag',
		emoji: '🌍',
		subFolders: [],
		files: testFiles
	})
];

export const folders = writable<Folder[]>([
	new Folder({
		name: 'Fag',
		subFolders: subjects,
		files: testFiles
	}),
	new Folder({
		name: 'Andet',
		subFolders: [],
		files: []
	})
]);
