// store.ts
import { writable, type Writable } from 'svelte/store';

export const canProceed = writable(true);

export const nextUrl = writable('');

export const userType: Writable<"tester" | "student" | "teacher" | "admin" | null> = writable();

export const selectedSchoolId = writable('');
export const selectedClassId = writable('');
