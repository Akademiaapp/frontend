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

type SelectResult<TableRow> = {
	data: TableRow[];
	error: PostgrestError;
};

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
	T extends keyof D['public']['Tables'] = keyof D['public']['Tables'],
	// Using hack to create type alias
	TRow extends TableRow<D, T> = TableRow<D, T>
> {
	tableName: keyof D['public']['Tables'];
	filter: Compare;
	unique: keyof TRow;
	supabase: SupabaseClient<D>;

	store = writable<TRow[]>(null);

	constructor(
		table: T,
		supabse: SupabaseClient<D>,
		unique: keyof TRow = 'id' as keyof TRow,
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

	getData(): TRow[] {
		return get(this.store);
	}

	async forceFetch(update = true): Promise<TRow[]> {
		const { data, error } = (await this.supabase
			.from(this.tableName)
			.select('id')) as SelectResult<TRow>;

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
			.insert(Array.isArray(d) ? d : [d])) as SelectResult<TRow>;

		if (error) {
			console.error(error);
		}
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
						this.insert([payload.new as TRow], false);
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
