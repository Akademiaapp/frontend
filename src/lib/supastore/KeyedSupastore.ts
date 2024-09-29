import { writable } from 'svelte/store';
import { SupaStore } from './SupaStore';
import type { ClientRow, GenericDatabase, TableInsert, TableRow } from './types';
import type { Compare } from './compare';

export class KeyedSupaStore<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables'] & string = keyof D['public']['Tables'] & string,
	// Using hack to create type alias
	TRow extends TableRow<D, T> = TableRow<D, T>,
	TInsert extends TableInsert<D, T> = TableInsert<D, T>
> extends SupaStore<D, T> {
	keyedStore = writable<Record<string | number, ClientRow<D, T>[]>>({});
	key: keyof TableRow<D, T> = 'path';

	setKey(key: keyof TableRow<D, T>) {
		this.key = key;
		return this;
	}

	init() {
		this.store.subscribe((data) => {
			this.keyedStore.set(Object.groupBy(data, (d) => d[this.key] as string));
		});

		this.eventHandler.on('insert', (clientRow: ClientRow<D, T>) => {
			this.keyedStore.update((prev) => {
				const key = clientRow[this.key] as string;
				prev[key] = [...(prev[key] ?? []), clientRow];
				return prev;
			});
		});
	}

	async _delete(compare: Compare, server?: boolean) {
		const r = await super._delete(compare, server);

		// this.keyedStore.update((prev) => {
		// 	Object.entries(prev).forEach(([k, v]) => {
		// 		prev[k] = v.filter((row) => compare.checkRow(row));
		// 	});

		// 	return prev;
		// });
		this._group();

		return r;
	}

	_group() {
		this.keyedStore.set(Object.groupBy(this.getData(), (d) => d[this.key] as string));
	}

	override async _update(changes, compare: Compare, server?: boolean) {
		const r = await super._update(changes, compare, server);
		this._group();
		return r;
	}

	override async forceFetch(update = true) {
		const r = await super.forceFetch(update);
		this._group();
		return r as TRow[];
	}
}
