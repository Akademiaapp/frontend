import { canProceed } from './onboardingStores.js';

export function load({ url }) {
	canProceed.set(true);

	return { url: url.pathname };
}
