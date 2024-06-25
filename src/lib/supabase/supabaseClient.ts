import { tomorrow } from '@/utils/dateUtils';
import type { Database, Tables } from '../supabase.types';

import { createIndexedDB, svelteSupabase } from './supaStore';
export const supabase = new svelteSupabase<Database>(
	'https://khpnlpgmzmocwqjkvemv.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocG5scGdtem1vY3dxamt2ZW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4NDIwNTIsImV4cCI6MjAzMzQxODA1Mn0.PfFI_eQ5qU6t9mlFUePdnVJHX6Xqt0UDAdUsTXWCPDI'
);

// console.log('supabase', supabase.auth);

// supabase.auth.onAuthStateChange((event, session) => {
// 	console.log('auth change', event, session);
// });
export type fileInfo = Tables<'assignment' | 'assignment_answer' | 'document'>;

export const documents = supabase.keyedStore('document', { useServer: true });

export const assignmentAnswers = supabase.store('assignment_answer');
export const assignmentFeedbacks = supabase.store('assignment_feedback');
export const users = supabase.store('user');
export const groups = supabase.store('group');
export const assignments = supabase.store('assignment').setDeafults(() => {
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
});

createIndexedDB([documents, assignments, assignmentAnswers, assignmentFeedbacks, users, groups]);

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
