import { writable } from 'svelte/store';

export const themeVariant = writable(localStorage.getItem('themeVariant') || 'light');

themeVariant.set('dark');
themeVariant.subscribe((value) => {
	localStorage.setItem('themeVariant', value);
});
