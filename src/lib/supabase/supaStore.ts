/* eslint-disable @typescript-eslint/no-unused-vars */
import { SupabaseClient, type PostgrestError } from '@supabase/supabase-js';
import { Compare, EQ } from './compare';
import { get, writable } from 'svelte/store';
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';

export type GenericDatabase = {
	public: GenericSchema;
};

export type TableRow<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables']
> = D['public']['Tables'][T]['Row'];
type TableInsert<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables']
> = D['public']['Tables'][T]['Insert'];
// type TableUpdate<T extends keyof Database['public']['Tables']> =
// 	Database['public']['Tables'][T]['Row'];

type SelectResult<TableRow> = {
	data: TableRow[];
	error: PostgrestError;
};

export class svelteSupabase<D extends GenericDatabase> extends SupabaseClient<D> {
	store<T extends keyof D['public']['Tables'] & string>(
		table: T,
		unique: keyof TableRow<D, T> & string = 'id' as keyof TableRow<D, T> & string,
		filter: Compare = new Compare(null, null)
	): SupabaseStore<D, T> {
		return new SupabaseStore<D, T>(table, this, unique, filter);
	}
}

export class SupabaseStore<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables'] & string = keyof D['public']['Tables'] & string,
	// Using hack to create type alias
	TRow extends TableRow<D, T> = TableRow<D, T>,
	TInsert extends TableInsert<D, T> = TableInsert<D, T>
> {
	tableName: T & string;
	filter: Compare;
	unique: keyof TRow;
	supabase: SupabaseClient<D>;

	// The cid should be used in svelte to identify the row. NOT the id
	// We can't use the id because, when we insert a new row from this client, the id is not set by the server yet.
	store = writable<(TRow & { cid: number })[]>([]);

	constructor(
		table: T,
		supabase: SupabaseClient<D>,
		unique: keyof TRow = 'id' as keyof TRow,
		filter: Compare = new Compare(null, null)
	) {
		this.tableName = table;
		this.filter = filter;
		this.unique = unique;
		this.supabase = supabase;

		this.supabase.auth.onAuthStateChange(async (event) => {
			if (event === 'SIGNED_IN') {
				await this.forceFetch();
			} else if (event === 'SIGNED_OUT') {
				this.store.set([]);
			}
		});
	}

	// This function should be set to generete the same deafult values as the server
	// eg. things like created_at and updated_at
	deafultGen: () => Partial<TRow> = () => ({});

	getData(): TRow[] {
		return get(this.store);
	}

	async forceFetch(update = true): Promise<TRow[]> {
		const { data, error } = (await this.supabase
			.from(this.tableName as string)
			.select('id')) as SelectResult<TRow>;

		if (error) {
			console.error(error);
			return null;
		}

		if (update) {
			this.store.set(data.map((row: any) => (row.cid = row.id)) as (TRow & { cid: number })[]);
		}
		return data;
	}

	async insert(d: TInsert, server = true) {
		const cid = this.getData().length + 1;
		const clientRow = {
			...(d as undefined as TRow),
			cid,
			...this.deafultGen()
		};
		this.store.update((prev) => [...prev, clientRow]);

		if (!server) return clientRow;

		const { data, error } = (await this.supabase
			.from(this.tableName)
			.insert([d] as any)) as SelectResult<TRow>;

		if (error) {
			console.error(error);
			return;
		}

		this.store.update((prev) => {
			const index = prev.findIndex((row) => row.cid === cid);
			if (index !== -1) {
				console.log(prev[index]);
				prev[index] = { ...data[0], cid };
			}
			return prev;
		});
	}

	async delete(value, colomn: keyof TRow = 'id' as keyof TRow, server = true) {
		return this._delete(new EQ(colomn, value), server);
	}

	async update(d, value, colomn: keyof TRow = 'id' as keyof TRow, server = true) {
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
			.select()) as SelectResult<TRow>;
	}

	async _delete(compare: Compare, server = true) {
		// if they got an id they should be used to find the correct row to delete
		// if not we search for an identical row
		this.store.update((prev) => prev.filter(compare.checkRow));

		if (!server) return;

		const { error } = (await compare
			.query(this.supabase.from(this.tableName).delete())
			.select()) as SelectResult<TRow>;

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
						this.insert(payload.new as TInsert, false);
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
