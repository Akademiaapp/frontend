import type { FileInfo } from '@/api/apiStore';
import { writable } from 'svelte/store';

export const isThemeChecked = writable(false);
export const activeFile = writable<FileInfo | null>(null);