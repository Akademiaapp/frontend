import { SupabaseClient } from '@supabase/supabase-js';
import { KeyedSupaStore } from './KeyedSupastore';
import { SupaStore } from './SupaStore';
import type { GenericDatabase, SupaStoreSettings } from './types';
import { ViewStore } from './ViewSupastore';

export class svelteSupabase<D extends GenericDatabase> extends SupabaseClient<D> {
	isInited = false;

	db;
	request;

	realtimeChannel = this.channel('custom-all-channel');
	store<T extends keyof D['public']['Tables'] & string>(
		table: T,
		settings: SupaStoreSettings = {}
	): SupaStore<D, T> {
		return new SupaStore<D, T>(table, this, settings, this.realtimeChannel);
	}

	keyedStore<T extends keyof D['public']['Tables'] & string>(
		table: T,
		settings: SupaStoreSettings = {}
	): KeyedSupaStore<D, T> {
		return new KeyedSupaStore<D, T>(table, this, settings, this.realtimeChannel);
	}

	viewStore<T extends keyof D['public']['Views'] & string>(
		table: T,
		baseTable: string,
		settings: SupaStoreSettings = {}
	) {
		return new ViewStore<D, T>(table, baseTable, this, settings);
	}
}
