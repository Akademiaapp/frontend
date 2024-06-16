import type { Database } from '../supabase.types';

import { createIndexedDB, svelteSupabase } from './supaStore';
export const supabase = new svelteSupabase<Database>(
	'https://khpnlpgmzmocwqjkvemv.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocG5scGdtem1vY3dxamt2ZW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4NDIwNTIsImV4cCI6MjAzMzQxODA1Mn0.PfFI_eQ5qU6t9mlFUePdnVJHX6Xqt0UDAdUsTXWCPDI'
);

console.log('supabase', supabase.auth);

supabase.auth.onAuthStateChange((event, session) => {
	console.log('auth change', event, session);
});

export const documents = supabase.keyedStore('document', { useServer: true });
export const files = supabase.store('assignment');

createIndexedDB([documents, files]);

documents.subscribe((data) => {
	console.log(data);
});

setTimeout(() => {
	documents.insert({ name: 'what??' });
}, 2000);
// documents.deafults = () => ({
// 	created_at: new Date().toISOString(),
// 	updated_at: new Date().toISOString(),
// 	name: 'Unavngivet'
// });

// documents.keyedStore.subscribe((data) => {
// 	console.log(data);
// });
