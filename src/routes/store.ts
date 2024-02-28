import { Assignment, type FileInfo } from '@/api/apiStore';
import { writable } from 'svelte/store';

export const themeVariant = writable(localStorage.getItem('themeVariant') || 'light');

themeVariant.subscribe((value) => {
	localStorage.setItem('themeVariant', value);
});

export const currentFile = writable<FileInfo | null>(null);

currentFile.set(new Assignment({}));
