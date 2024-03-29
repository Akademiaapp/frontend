import { goto } from '$app/navigation';
import api from '@/api';

export async function redirect() {
	// check if the user is correctly set up

	const req = await api.callApi('isUserSetupCurrecly', null, 'GET');
	// const isUserSetupCurrecly = (await req.json()).isUserSetupCurrecly;
	const isUserSetupCurrecly = true;
	//TODO: change to actual fetching the data

	if (!isUserSetupCurrecly) {
		// if not, redirect to the onboarding
		goto('/onboarding');
	} else {
		// else redirect to the workspace
		goto('/workspace');
	}
}
