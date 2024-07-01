import type { RealtimePostgresChangesPayload, SupabaseClient } from '@supabase/supabase-js';
import type { SupaStore } from './SupaStore';
import type { AnyStore, GenericDatabase, SelectResultSingle, TableInsert, TableRow } from './types';

export class RealtimeHandler<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables'] & string = keyof D['public']['Tables'] & string, // The main Table
	// Using hack to create type alias
	TRow extends TableRow<D, T> = TableRow<D, T>,
	TInsert extends TableInsert<D, T> = TableInsert<D, T>
> {
	supaStore: SupaStore<D, T>;

	baseTableName: string;

	constructor(baseTableName: T, SupaStore: SupaStore<D, T>) {
		this.supaStore = SupaStore;
		this.baseTableName = baseTableName;

		this.subscribeSupabase(baseTableName);
	}

	addTable<Table extends keyof D['public']['Tables']>(
		table: Table,
		keyNewTable: keyof TableRow<D, Table>,
		keyFetchTable: keyof TableRow<D, T> & string
	) {
		this.addAllListener(table, async (payload) => {
			if (payload.eventType === 'INSERT') {
				const { data, error } = (await this.supaStore.supabase
					.from(this.supaStore.tableName)
					.select('*')
					.eq(keyFetchTable, payload.new[keyNewTable])
					.single()) as SelectResultSingle<TRow>;

				if (error) {
					console.error(error);
					return;
				}

				this.supaStore.upsert(payload.new[keyNewTable], data, keyFetchTable, false);
			}
		});
	}

	addAllListener(table, callback: (payload: RealtimePostgresChangesPayload<TRow>) => void) {
		this.supaStore.supabase
			.channel('custom-all-channel')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: table },
				(payload: RealtimePostgresChangesPayload<TRow>) => {
					callback(payload);
				}
			)
			.subscribe();
	}

	async subscribeSupabase(table) {
		this.addAllListener(table, (payload) => {
			if (payload.eventType === 'INSERT') {
				this.supaStore.insert(payload.new as unknown as TInsert, false);
			}
			if (payload.eventType === 'DELETE') {
				this.supaStore.delete(payload.old[this.supaStore.unique], undefined, false);
			}
			if (payload.eventType === 'UPDATE') {
				// We use upsert to insert the row if somehow it is not yet in the local
				this.supaStore.upsert(payload.old[this.supaStore.unique], payload.new, undefined, false);
			}
		});
	}
}
