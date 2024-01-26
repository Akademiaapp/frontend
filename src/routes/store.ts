import type { FileInfo } from '@/api/apiStore';
import { writable } from 'svelte/store';

export const isLightTheme = writable(false);
export const activeFile = writable<FileInfo | null>(null);
