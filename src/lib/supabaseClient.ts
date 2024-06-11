import { createClient, type PostgrestError } from '@supabase/supabase-js';
import type { Database } from './supabase.types';
import { get, writable } from 'svelte/store';

export const supabase = createClient<Database>(
	'https://khpnlpgmzmocwqjkvemv.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocG5scGdtem1vY3dxamt2ZW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4NDIwNTIsImV4cCI6MjAzMzQxODA1Mn0.PfFI_eQ5qU6t9mlFUePdnVJHX6Xqt0UDAdUsTXWCPDI'
);

type TableRow<K extends keyof Database['public']['Tables']> =
	Database['public']['Tables'][K]['Row'];
type TableInsert<K extends keyof Database['public']['Tables']> =
	Database['public']['Tables'][K]['Row'];
type TableUpdate<K extends keyof Database['public']['Tables']> =
	Database['public']['Tables'][K]['Row'];

type SelectResult<K extends keyof Database['public']['Tables']> = {
	data: TableRow<K>[];
	error: PostgrestError;
};

export class SupabaseStore<K extends keyof Database['public']['Tables']> {
	tableName: keyof Database['public']['Tables'];
	store = writable<TableRow<K>[] & { isServerValidatet: boolean | null }>(null);

	constructor(table: K) {
		this.tableName = table;

		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_IN') {
				await this.forceFetch();
			} else if (event === 'SIGNED_OUT') {
				this.store.set(null);
			}
		});
	}

	getData(): TableRow<K>[] {
		return get(this.store);
	}

	async forceFetch(update = true): Promise<TableRow<K>[]> {
		const { data, error } = (await supabase.from(this.tableName).select('id')) as SelectResult<K>;

		if (error) {
			console.error(error);
			return null;
		}
		if (update) {
			this.store.set(data);
		}
		return data;
	}

	async insert(data: TableInsert<K>[]) {
		const { error } = await supabase.from(this.tableName).insert(data);

		if (error) {
			console.error(error);
		}
	}
}

const documents = new SupabaseStore('document');
const assignments = new SupabaseStore('assignment');

// documents.getData()[0].isNote;
