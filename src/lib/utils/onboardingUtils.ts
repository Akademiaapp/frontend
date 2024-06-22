import { goto } from '$app/navigation';

import { supabase } from '@/supabase/supabaseClient';
import { session } from '../../routes/store';
import { get } from 'svelte/store';

export async function redirect() {
	// check if the user is correctly set up
	const isUserSetupCurrecly = await isUserSetupCurrectly();

	if (!isUserSetupCurrecly) {
		// if not, redirect to the onboarding
		goto('/onboarding');
	} else {
		// else redirect to the workspace
		goto('/workspace');
	}
}

export async function isUserSetupCurrectly() {
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
