import type { AuthSession } from '@supabase/supabase-js';
import { writable, type Writable } from 'svelte/store';

export const themeVariant = writable(localStorage.getItem('themeVariant') || 'light');

themeVariant.subscribe((value) => {
	localStorage.setItem('themeVariant', value);
});

export const sidebarWidth = writable('300px');

export const session: Writable<AuthSession> = writable(null);