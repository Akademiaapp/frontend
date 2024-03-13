import { canProceed } from './proccedStore.js';

export function load({ url }) {
	canProceed.set(true);
	return { url: url.pathname };
}
