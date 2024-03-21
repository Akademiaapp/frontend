// store.ts
import { writable } from 'svelte/store';

export const canProceed = writable(true);

export const nextUrl = writable('');

export const userType = writable('');
export const selectedSchool = writable('');
