import type { ClientRow, GenericDatabase } from './types';

export class EventHandler<
	D extends GenericDatabase,
	T extends keyof D['public']['Tables'] & string
> {
	on(
		event: 'insert' | 'update' | 'delete' | 'insert-confirmation' | 'force-fetch',
		callback: (...args) => void
	) {
		this.eventEmitter.addEventListener(event, callback);
	}

	emit(
		event: 'insert' | 'update' | 'delete' | 'insert-confirmation' | 'force-fetch',
		...args: unknown[]
	) {
		this.eventEmitter.dispatchEvent(new CustomEvent(event, { detail: args }));
	}

	// emits = {
	// 	insert: (clientRow: ClientRow<D, T>) => this.emit('insert', clientRow),
	// 	update: (key, clientRow: ClientRow<D, T>) => this.emit('update', key, clientRow),
	// 	delete: (clientRow: ClientRow<D, T>) => this.emit('delete', clientRow),
	// 	'insert-confirmation': (clientRow) => this.emit('insert-confirmation', clientRow),
	// 	'force-fetch': () => this.emit('force-fetch')
	// };

	eventEmitter = new EventTarget();
}
