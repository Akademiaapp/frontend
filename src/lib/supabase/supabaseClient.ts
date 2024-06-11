import { createClient, type PostgrestError } from '@supabase/supabase-js';
import type { Database } from '../supabase.types';

import { get, writable } from 'svelte/store';
import { EQ, Compare } from './compare';

export const supabase = createClient<Database>(
	'https://khpnlpgmzmocwqjkvemv.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocG5scGdtem1vY3dxamt2ZW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4NDIwNTIsImV4cCI6MjAzMzQxODA1Mn0.PfFI_eQ5qU6t9mlFUePdnVJHX6Xqt0UDAdUsTXWCPDI'
);

export type TableRow<K extends keyof Database['public']['Tables']> =
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
	filter: Compare;
	unique: keyof TableRow<K>;

	store = writable<TableRow<K>[]>(null);

	constructor(
		table: K,
		unique: keyof TableRow<K> = 'id' as keyof TableRow<K>,
		filter: Compare = new Compare(null, null)
	) {
		this.tableName = table;
		this.filter = filter;
		this.unique = unique;

		supabase.auth.onAuthStateChange(async (event) => {
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

	async insert(d: TableInsert<K>[] | TableInsert<K>, server = true) {
		this.store.update((prev) => [...prev, ...data]);

		if (!server) return;

		const { data, error } = (await supabase
			.from(this.tableName)
			.insert(Array.isArray(d) ? d : [d])) as SelectResult<K>;

		if (error) {
			console.error(error);
		}
	}

	async delete(row, colomn: keyof TableRow<K> = 'id' as keyof TableRow<K>, server = true) {
		return this._delete(new EQ(colomn, row[this.unique]), server);
	}

	async update(d, value, colomn: keyof TableRow<K> = 'id' as keyof TableRow<K>, server = true) {
		return this._update(d, new EQ(colomn, value), server);
	}

	async _update(changes, compare: Compare, server = true) {
		// apply the changes to the localy
		this.store.update((prev) =>
			prev.map((row) => (compare.check(row) ? { ...row, ...changes } : row))
		);
		if (!server) return;

		const { error } = (await compare
			.query(supabase.from(this.tableName).update(changes))
			// here we use the compare to find the correct row
			.select()) as SelectResult<K>;
	}

	async _delete(compare: Compare, server = true) {
		// if they got an id they should be used to find the correct row to delete
		// if not we search for an identical row
		this.store.update((prev) => prev.filter(compare.checkRow));

		if (!server) return;

		const { error } = (await compare
			.query(supabase.from(this.tableName).delete())
			.select()) as SelectResult<K>;

		if (error) {
			console.error(error);
		}
	}

	async _subscribe() {
		supabase
			.channel('custom-all-channel')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: this.tableName },
				(payload) => {
					if (payload.eventType === 'INSERT') {
						this.insert([payload.new as TableRow<K>], false);
					}
					if (payload.eventType === 'DELETE') {
						this.delete(payload.old, undefined, false);
					}

					console.log('Change received!', payload);
				}
			)
			.subscribe();
	}
}

const documents = new SupabaseStore('document');

documents.delete({ id: 1 }, 'id');

documents.getData()?.[0].isNote;
