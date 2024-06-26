import { type PostgrestError } from '@supabase/supabase-js';
import { Compare } from './compare';
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';
import type { SupaStore } from './SupaStore';

export type GenericDatabase = {
	public: GenericSchema;
};

export type TableRow<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables']
> = D['public']['Tables'][T]['Row'];
export type TableInsert<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables']
> = D['public']['Tables'][T]['Insert'];

export type ClientRow<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables'] & string
> = TableRow<D, T> & { cid: number; table: SupaStore<D, T> };
// type TableUpdate<T extends keyof Database['public']['Tables']> =
// 	Database['public']['Tables'][T]['Row'];

export type SelectResult<TableRow> = {
	data: TableRow[];
	error: PostgrestError;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyStore = SupaStore<any, string, any, any>;

export type SupaStoreSettings = {
	unique?: string;
	filter?: Compare;
	useServer?: boolean;
	useIndexedDB?: boolean;
	realtime?: boolean;
};
