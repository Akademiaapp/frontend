import { writable } from 'svelte/store';
import { SupaStore } from './SupaStore';
import type { GenericDatabase, TableInsert, TableRow } from './types';
import type { Compare } from './compare';

export class KeyedSupaStore<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables'] & string = keyof D['public']['Tables'] & string,
	// Using hack to create type alias
	TRow extends TableRow<D, T> = TableRow<D, T>,
	TInsert extends TableInsert<D, T> = TableInsert<D, T>
> extends SupaStore<D, T> {
	keyedStore = writable<Partial<Record<string | number, (TableRow<D, T> & { cid: number })[]>>>({});
	key: keyof TableRow<D, T> = 'path';

	setKey(key: keyof TableRow<D, T>) {
		this.key = key;
		return this;
	}

	init() {
		this.store.subscribe((data) => {
			this.keyedStore.set(Object.groupBy(data, (d) => d[this.key] as string));
		});
	}

	override insert(
		d: TInsert,
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

	override async _update(changes, compare: Compare, server?: boolean): Promise<void> {
		const r = await super._update(changes, compare, server);
		this._group();
		return r;
	}

	override async forceFetch(update = true): Promise<TRow[]> {
		const r = await super.forceFetch(update);
		this._group();
		return r as TRow[];
	}
}
