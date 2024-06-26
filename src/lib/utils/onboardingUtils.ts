import { goto } from '$app/navigation';

import { supabase } from '@/supabase/supabaseClient';
import { isOnline, session } from '../../routes/store';
import { get } from 'svelte/store';
import { page } from '$app/stores';

export async function redirect() {
	// check if the user is correctly set up
	console.log('AIOSHDIUHSIDUHUIAHSIDHOIAHSDUI');
	const isUserSetupCurrecly = await isUserSetupCurrectly();

	if (!isUserSetupCurrecly && get(isOnline)) {
		// if not, redirect to the onboarding
		goto('/onboarding');
	} else {
		if (!get(page).url.pathname.includes('onboarding')) return;
		console.log('Redirecting!');
		// else redirect to the workspace
		goto('/workspace/home');
	}
}

export async function isUserSetupCurrectly() {
	if (!get(session).user) return false;
	const { data, error } = await supabase
		.from('user')
		.select('*')
		.eq('id', get(session).user.id)
		.single();

	if (error || !data.type || !data.school_id) {
		return false;
	} else {
		return true;
	}
}
