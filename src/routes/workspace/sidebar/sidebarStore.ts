import { Folder } from '@/api/fileClasses';
import { writable } from 'svelte/store';

export const draggingFile = writable(null);
export const isDragging = writable(false);
export const currentTab = writable('files');

const testFiles = [];

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
