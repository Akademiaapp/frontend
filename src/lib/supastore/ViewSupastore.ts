import type { SupabaseClient } from '@supabase/supabase-js';
import { SupaStore } from './SupaStore';
import type {
	ClientRow,
	GenericDatabase,
	SelectResult,
	SelectResultSingle,
	SupaStoreSettings,
	TableInsert,
	TableRow
} from './types';

export class ViewStore<
	D extends GenericDatabase,
	T extends keyof D['public']['Views'] & string = keyof D['public']['Views'] & string,
	// Using hack to create type alias
	TRow extends TableRow<D, T> = TableRow<D, T>,
	TInsert extends TableInsert<D, T> = TableInsert<D, T>
> extends SupaStore<D, T> {
	constructor(
		table: T,
		baseTable: string,
		supabase: SupabaseClient<D>,
		settings: SupaStoreSettings = {}
	) {
		// set needed things
		super(table, supabase, settings);
		this.baseTableName = baseTable;

		this.eventHandler.on('insert', async (row: ClientRow<D, T>) => {
			await this.updRowFromView(row[this.unique]);
		});

		this.eventHandler.on('update', async (key: string) => {
			await this.updRowFromView(key);
		});
	}

	async updRowFromView(key) {
		const { data, error } = (await this.supabase
			.from(this.tableName)
			.select('*')
			.eq(this.unique, key)
			.single()) as SelectResultSingle<TRow>;

		if (error) {
			console.error(error);
			return;
		}

		this.update(data[this.unique], data, undefined, false);
	}
}
