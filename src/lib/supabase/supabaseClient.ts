import { tomorrow } from '@/utils/dateUtils';
import type { Database, Tables } from '../supabase.types';

import { isOnline } from '../../routes/store';
import { get } from 'svelte/store';
import { createIndexedDB } from '@/supastore/indexedDB';
import { svelteSupabase } from '@/supastore/SvelteSupabase';

export const supabase = new svelteSupabase<Database>(
	'https://khpnlpgmzmocwqjkvemv.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocG5scGdtem1vY3dxamt2ZW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4NDIwNTIsImV4cCI6MjAzMzQxODA1Mn0.PfFI_eQ5qU6t9mlFUePdnVJHX6Xqt0UDAdUsTXWCPDI'
);

// console.log('supabase', supabase.auth);

// supabase.auth.onAuthStateChange((event, session) => {
// 	console.log('auth change', event, session);
// });
let online = get(isOnline);
isOnline.subscribe((value) => {
	if (value === online) return;
	online = value;
	documents.useServer = value;
	assignments.useServer = value;
	assignmentAnswers.useServer = value;
	assignmentFeedbacks.useServer = value;
	users.useServer = value;
	groups.useServer = value;
});

export type FileInfo = Tables<'assignment' | 'assignment_answer' | 'document'>;

export const documents = supabase.keyedStore('document', { useServer: online });

export const assignmentAnswers = supabase.store('assignment_answer', { useServer: online });
export const assignmentFeedbacks = supabase.store('assignment_feedback', { useServer: online });
export const users = supabase.store('user', { useServer: online });
export const groups = supabase.store('group', { useServer: online });
export const assignments = supabase.store('assignment', { useServer: online }).setDeafults(() => {
	const dueDate = tomorrow();
	return {
		name: 'Unavngivet',
		due_date: new Date(
			dueDate.getFullYear(),
			dueDate.getMonth(),
			dueDate.getDate(),
			23,
			45
		).toISOString()
	};
}, true);

export const filePermissions = supabase.store('file_permission', { useServer: online });

createIndexedDB([
	documents,
	assignments,
	assignmentAnswers,
	assignmentFeedbacks,
	users,
	groups,
	filePermissions
]);

supabase.realtimeChannel.subscribe();

documents.subscribe((data) => {
	console.log('documents:', data);
});

// documents.deafults = () => ({
// 	created_at: new Date().toISOString(),
// 	updated_at: new Date().toISOString(),
// 	name: 'Unavngivet'
// });

// documents.keyedStore.subscribe((data) => {
// 	console.log(data);
// });
