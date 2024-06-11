import { SupabaseClient, createClient, type PostgrestError } from '@supabase/this.supabase-js';
import type { Database } from '../supabase.types';

import { get, writable } from 'svelte/store';
import { EQ, Compare } from './compare';
export const supabase = createClient<Database>(
	'https://khpnlpgmzmocwqjkvemv.this.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocG5scGdtem1vY3dxamt2ZW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4NDIwNTIsImV4cCI6MjAzMzQxODA1Mn0.PfFI_eQ5qU6t9mlFUePdnVJHX6Xqt0UDAdUsTXWCPDI'
) as svelteSupabase<Database>;

export type typicalDatabase = {
	public: { Tables: Record<string, { Row: Record<string, unknown> }> };
};

export type TableRow<
	D extends typicalDatabase,
	T extends keyof D['public']['Tables']
> = D['public']['Tables'][T]['Row'];
type TableInsert<
	D extends typicalDatabase,
	T extends keyof D['public']['Tables']
> = D['public']['Tables'][T]['Row'];
// type TableUpdate<T extends keyof Database['public']['Tables']> =
// 	Database['public']['Tables'][T]['Row'];

type SelectResult<D extends typicalDatabase, T extends keyof D['public']['Tables']> = {
	data: TableRow<D, T>[];
	error: PostgrestError;
};

class MyClass {
    // Type alias within the class
    private type Coordinates = {
        x: number;
        y: number;
    };

    // Interface within the class
    interface Point {
        x: number;
        y: number;
    };

    // Using the type alias
    getCoordinates(): Coordinates {
        return { x: 0, y: 0 };
    }

    // Using the interface
    getPoint(): Point {
        return { x: 0, y: 0 };
    }
}
class svelteSupabase<D extends typicalDatabase> extends SupabaseClient<D> {
	store<T extends keyof D['public']['Tables']>(
		table: T,
		unique: keyof TableRow<D, T> = 'id' as keyof TableRow<D, T>,
		filter: Compare = new Compare(null, null)
	): SupabaseStore<D, T> {
		return new SupabaseStore<D, T>(table, this, unique, filter);
	}
}

export class SupabaseStore<
	D extends typicalDatabase,
	T extends keyof D['public']['Tables'] = keyof D['public']['Tables']
> {
	tableName: keyof D['public']['Tables'];
	filter: Compare;
	unique: keyof TableRow<D, T>;
	supabase: SupabaseClient<D>;

	store = writable<TableRow<D, T>[]>(null);

	constructor(
		table: T,
		supabse: SupabaseClient<D>,
		unique: keyof TableRow<D, T> = 'id' as keyof TableRow<D, T>,
		filter: Compare = new Compare(null, null)
	) {
		this.tableName = table;
		this.filter = filter;
		this.unique = unique;
		this.supabase = supabse;

		this.supabase.auth.onAuthStateChange(async (event) => {
			if (event === 'SIGNED_IN') {
				await this.forceFetch();
			} else if (event === 'SIGNED_OUT') {
				this.store.set(null);
			}
		});
	}

	getData(): TableRow<D, T>[] {
		return get(this.store);
	}

	async forceFetch(update = true): Promise<TableRow<D, T>[]> {
		const { data, error } = (await this.supabase.from(this.tableName).select('id')) as SelectResult<
			D,
			T
		>;

		if (error) {
			console.error(error);
			return null;
		}
		if (update) {
			this.store.set(data);
		}
		return data;
	}

	async insert(d: TableInsert<D, T>[] | TableInsert<D, T>, server = true) {
		this.store.update((prev) => [...prev, ...data]);

		if (!server) return;

		const { data, error } = (await this.supabase
			.from(this.tableName)
			.insert(Array.isArray(d) ? d : [d])) as SelectResult<D, T>;

		if (error) {
			console.error(error);
		}
	}

	async delete(value, colomn: keyof TableRow<D, T> = 'id' as keyof TableRow<D, T>, server = true) {
		return this._delete(new EQ(colomn, value), server);
	}

	async update(
		d,
		value,
		colomn: keyof TableRow<D, T> = 'id' as keyof TableRow<D, T>,
		server = true
	) {
		return this._update(d, new EQ(colomn, value), server);
	}

	async _update(changes, compare: Compare, server = true) {
		// apply the changes to the localy
		this.store.update((prev) =>
			prev.map((row) => (compare.check(row) ? { ...row, ...changes } : row))
		);
		if (!server) return;

		const { error } = (await compare
			.query(this.supabase.from(this.tableName).update(changes))
			// here we use the compare to find the correct row
			.select()) as SelectResult<D, T>;
	}

	async _delete(compare: Compare, server = true) {
		// if they got an id they should be used to find the correct row to delete
		// if not we search for an identical row
		this.store.update((prev) => prev.filter(compare.checkRow));

		if (!server) return;

		const { error } = (await compare
			.query(this.supabase.from(this.tableName).delete())
			.select()) as SelectResult<D, T>;

		if (error) {
			console.error(error);
		}
	}

	async _subscribe() {
		this.supabase
			.channel('custom-all-channel')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: this.tableName },
				(payload) => {
					if (payload.eventType === 'INSERT') {
						this.insert([payload.new as TableRow<D, T>], false);
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

const i = new SupabaseStore('', supabase);

const documents = supabase.store('document');

documents.delete(1);

documents.getData()?.[0].isNote;
