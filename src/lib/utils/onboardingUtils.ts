import { goto } from '$app/navigation';
import type { Tables } from '@/supabase.types';

import { supabase } from '@/supabaseClient';

// import api from '@/api';

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
	const { data, error } = await supabase.from('user').select('*').eq('id', supabase.auth.user()?.id).single();

	if (error || !data.type) {
		return false;
	} else {
		return true;
	}

	// const req = await api.callApi('/users/self', null, 'GET');
	// const json = await req.json();

	// return !(
	// 	json.schoolId === null ||
	// 	json.schoolId === undefined ||
	// 	json.type === null ||
	// 	json.type === undefined
	// );
}
