import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { SupaStore } from './SupaStore';
import type { GenericDatabase, SelectResultSingle, TableInsert, TableRow } from './types';

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

	/**
	 * Listens to an extra table.
	 *
	 * Usefull if changes in other tables, affects the main/view table.
	 *
	 * @template Table - The name of the table to add.
	 * @param {Table} table - The name of the table to add.
	 * @param {keyof TableRow<D, Table>} keyNewTable - The key that should be used on the newly added table.
	 * @param {keyof TableRow<D, T> & string} keyFetchTable - The key used on the main/view table
	 * @returns {void}
	 */
	addTable<Table extends keyof D['public']['Tables']>(
		table: Table,
		keyNewTable: keyof TableRow<D, Table>,
		keyFetchTable: keyof TableRow<D, T> & string
	) {
		this.addAllListener(table, async (payload) => {
			// This will trigger when a change happens in the new table
			// If this happens we will refetch the affected row from the view/main table

			// Get what row we should refetch
			const value =
				payload.eventType == 'DELETE' ? payload.old[keyNewTable] : payload.new[keyNewTable];

			// Refetch the row from the view/main table
			const { data, error } = (await this.supaStore.supabase
				.from(this.supaStore.tableName)
				.select('*')
				.eq(keyFetchTable, value)
				.single()) as SelectResultSingle<TRow>;

			if (error) {
				console.error(error);
				return;
			}

			// Upsert the row, because it might not be in the local store yet
			this.supaStore.upsert(value, data, keyFetchTable, false);
		});
	}

	/**
	 * Adds a listener for all changes on a specific table.
	 * @param {string} table - The name of the table to listen for changes on.
	 * @param {function} callback - The callback function to be called when changes occur on the specified table.
	 * @example
	 * // Listen for changes on the "users" table
	 * addAllListener('users', (payload) => {
	 *   console.log('Changes occurred on the "users" table:', payload);
	 * });
	 */
	/**
	 * Adds a listener for all changes on a specific table.
	 * @param table - The name of the table to listen for changes on.
	 * @param callback - The callback function to be called when changes occur on the specified table.
	 */
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

	/**
	 * Subscribes to changes in a Supabase table and updates the SupaStore accordingly.
	 *
	 * @param table - The name of the table to subscribe to.
	 */
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
