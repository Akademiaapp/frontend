import type { AuthSession } from '@supabase/supabase-js';
import type { Tables } from '$lib/supabase.types';

import { get, writable, type Writable } from 'svelte/store';

export const themeVariant = writable(localStorage.getItem('themeVariant') || 'light');

themeVariant.subscribe((value) => {
	localStorage.setItem('themeVariant', value);
});

export const sidebarWidth = writable('300px');

export const session: Writable<AuthSession | null> = writable(null);
export const userInfo: Writable<Tables<'user'>> = writable(null);
export const isOnline: Writable<boolean> = writable(true);
