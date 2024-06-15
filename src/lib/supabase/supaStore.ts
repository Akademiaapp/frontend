/* eslint-disable @typescript-eslint/no-unused-vars */
import { SupabaseClient, type PostgrestError } from '@supabase/supabase-js';
import { Compare, EQ } from './compare';
import { get, writable } from 'svelte/store';
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';
import { randomUUID } from 'crypto';

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
	): SupaStore<D, T> {
		return new SupaStore<D, T>(table, this, unique, filter);
	}
}

export class SupaStore<
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
	subscribe = this.store.subscribe;
	set = this.store.set;

	constructor(
		table: T,
		supabase: SupabaseClient<D>,
		unique: keyof TRow = 'id' as keyof TRow,
		filter: Compare = new Compare(null, null)
	) {
		this.filter = filter;
		this.unique = unique;
		this.supabase = supabase;
		this.subscribeSupabase();

		this.supabase.auth.onAuthStateChange(async (event) => {
			if (event === 'SIGNED_IN') {
				setTimeout(async () => {
					await this.forceFetch();
				}, 0);
			} else if (event === 'SIGNED_OUT') {
				this.store.set([]);
			}
		});
	}

	useFilter(filter: Compare) {
		this.filter = filter;
		return this;
	}

	// This function should be set to generete the same deafult values as the server
	// eg. things like created_at and updated_at
	deafults: () => Partial<TRow> = () => ({});

	setDeafults(deafults: typeof this.deafults) {
		this.deafults = deafults;
		return this;
	}

	getData() {
		return get(this.store);
	}

	async forceFetch(update = true): Promise<TRow[]> {
		const { data, error } = (await this.supabase
			.from('document')
			.select('*')) as SelectResult<TRow>;

		if (error) {
			console.error(error);
			return null;
		}

		if (update) {
			this.store.set(data.map((row) => ({ ...row, cid: row.cid })) as (TRow & { cid: number })[]);
		}
		return data;
	}

	async insert(d: TInsert[] | TInsert, server = true) {
		const insertData = Array.isArray(d) ? d : [d as D['public']['Tables'][T]['Insert']];
		const cid = this.getData().length + 1;
		const clientRow = {
			...this.deafults(),
			...(d as undefined as TRow),
			cid
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
			prev.map((row) => (compare.checkRow(row) ? { ...row, ...changes } : row))
		);
		if (!server) return;

		const { error } = (await compare
			.query(this.supabase.from(this.tableName).update(changes))
			// here we use the compare to find the correct row
			.select()) as SelectResult<TRow>;
	}

	async _delete(compare: Compare, server = true) {
		this.store.update((prev) => prev.filter((row) => !compare.checkRow(row)));

		if (!server) return;

		const { error } = (await compare
			.query(this.supabase.from(this.tableName).delete())
			.select()) as SelectResult<TRow>;

		if (error) {
			console.error(error);
		}
	}

	async subscribeSupabase() {
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
						this.delete((payload.old as TRow)[this.unique], undefined, false);
					}
					if (payload.eventType === 'UPDATE') {
						// If the row is not in the local store, we insert it
						if (
							this.getData().findIndex(
								(row) => row[this.unique] === (payload.old as TRow)[this.unique]
							) === -1
						) {
							this.insert(payload.new as TInsert, false);
						} else {
							this.update(payload.new, (payload.old as TRow)[this.unique], undefined, false);
						}
					}
				}
			)
			.subscribe();
	}
}

export class KeyedSupaStore<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables'] & string = keyof D['public']['Tables'] & string,
	// Using hack to create type alias
	TRow extends TableRow<D, T> = TableRow<D, T>,
	TInsert extends TableInsert<D, T> = TableInsert<D, T>
> extends SupaStore<D, T> {
	keyedStore = writable<Partial<Record<string | number, (TableRow<D, T> & { cid: number })[]>>>({});
	key: keyof TableRow<D, T> = 'path';

	init() {
		this.store.subscribe((data) => {
			this.keyedStore.set(Object.groupBy(data, (d) => d[this.key] as string));
		});
	}

	override insert(
		d: TableInsert<D, T>[] | TInsert,
		server?: boolean
	): Promise<Partial<TableRow<D, T>> & TableRow<D, T> & { cid: number }> {
		this.keyedStore.update((prev) => {
			const cid = this.getData().length + 1;
			const clientRow = {
				...this.deafults(),
				...(d as undefined as TRow),
				cid
			};
			prev[clientRow[this.key] as string] = [
				...(prev[clientRow[this.key] as string] ?? []),
				clientRow
			];

			return prev;
		});
		return super.insert(d, server);
	}

	async _delete(compare: Compare, server?: boolean) {
		const r = await super._delete(compare, server);

		this.keyedStore.update((prev) => {
			Object.entries(prev).forEach(([k, v]) => {
				prev[k] = v.filter((row) => compare.checkRow(row));
			});

			return prev;
		});
		this.getData();
		this.keyedStore.set(Object.groupBy(this.getData(), (d) => d[this.key] as string));

		return r;
	}

	// override _delete(compare: Compare, server?: boolean): Promise<void> {
	// 	this.keyedStore.update((prev) => {
	// 		const key = Object.keys(prev).forEach(a => {
	// 			a.filter(row => compare.checkRow(row) ? prev[a] : null);
	// 		});

	// 		return prev;
	// 	});
	// 	return super._delete(compare, server);
	// }
}

const inventory = [
	{ name: 'asparagus', type: 'vegetables', quantity: 5 },
	{ name: 'bananas', type: 'fruit', quantity: 0 },
	{ name: 'goat', type: 'meat', quantity: 23 },
	{ name: 'cherries', type: 'fruit', quantity: 5 },
	{ name: 'fish', type: 'meat', quantity: 22 }
];

const result = Object.groupBy(inventory, (type) => type.type);
