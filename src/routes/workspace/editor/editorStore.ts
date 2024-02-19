import { writable } from 'svelte/store';
import type { Editor } from 'svelte-tiptap';

export const editor = writable<Editor>();
