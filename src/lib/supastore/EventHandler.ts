export class EventHandler {
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
	eventEmitter = new EventTarget();
}
