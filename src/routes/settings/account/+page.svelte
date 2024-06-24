<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '@/components/ui/button';
	import Card from '@/components/ui/card/card.svelte';
	import { supabase } from '@/supabase/supabaseClient';
	import { goto } from '$app/navigation';
	import { userInfo } from '@/../routes/store';
	import { onMount } from 'svelte';
	import type { Tables } from '@/supabase.types';

	let deleteOpen = false;
	let logoutOpen = false;

	function deleteProfile() {
		supabase.rpc('delete_user').then(() => {
			supabase.auth.signOut({ scope: 'local' }).then(() => {
				goto('/onboarding/login');
			})
		});
	}

	let school: Tables<'school'>;
	let user: Tables<'user'>;
	let loading = true;

	onMount(() => {
		getProfile();
	});

	async function getProfile() {
		try {
			loading = true;

			const { data, error, status } = await supabase.from('user').select('*').eq('id', $userInfo.id).single();
			if (error && status !== 406) throw error;

			user = data;

			const { data: schoolData, error: schoolError, status: schoolStatus } = await supabase.from('school').select('*').eq('id', user.school_id).single();
			if (schoolError && schoolStatus !== 406) throw schoolError;

			school = schoolData;
		} catch (error) {
			console.error('Error fetching user profile:', error.message);
		} finally {
			loading = false;
		}
	}

	async function updateProfile() {
		try {
			loading = true;

			const { data, error, status } = await supabase.from('user').update({ full_name: user.full_name }).eq('id', $userInfo.id).select().single();
			if (error && status !== 406) throw error;

			user = data;
			userInfo.set(data);
		} catch (error) {
			console.error('Error updating user profile:', error.message);
		} finally {
			loading = false;
		}
	
	}
</script>

{#if $userInfo && school}
	<div class="mb-8 text-lg">
		<h1 class="mb-4 text-5xl">{$userInfo.full_name}</h1>
		<p>Username: {$userInfo.username}</p>

		<Card class="my-2 p-4 px-6">
			<h2 class="mb-1 text-2xl">Skole</h2>
			<p></p>
			<p>Navn: {school.name}</p>
			<p>Addresse: {school.address}</p>
			<p>By: {school.city}</p>
			<p>Id: {school.id}</p>
		</Card>
	</div>
{/if}
{#if user}
<form on:submit|preventDefault="{updateProfile}" class="form-widget">
  <div>username: {user.username}</div>
  <div>
    <label for="username">Name</label>
    <input id="full_name" type="text" bind:value="{user.full_name}" />
  </div>
  <div>
    <button type="submit" class="button primary block" disabled="{loading}">
      {loading ? 'Saving ...' : 'Update profile'}
    </button>
  </div>
  <button type="button" class="button block" on:click={() => supabase.auth.signOut()}> Sign Out
  </button>
</form>
{/if}

<Dialog.Dialog bind:open={logoutOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default'})}>
		<span class="text box-border overflow-hidden font-semibold leading-normal"
			>Log ud af alle enhedder</span
		>
	</Dialog.Trigger>

	<Dialog.Content class="max-w-[30rem]">
		<Dialog.Title>Er du sikker på, at du vil logge ud af alle enhedder?</Dialog.Title>
		<Dialog.Description
			>
			Dette vil logge dig ud af alle enheder, inklusive denne. Du vil blive nødt til at logge ind igen på alle enheder.
			</Dialog.Description
		>
		<div class="flex w-full gap-2">
			<Button variant="outline" class="flex-1" on:click={() => (logoutOpen = false)}>Nej</Button>
			<Button variant="destructive" class="flex-1" on:click={() => supabase.auth.signOut({ scope: 'global' }).then(() => goto('/onboarding/login'))}>Slet</Button>
		</div>
	</Dialog.Content>
</Dialog.Dialog>

<Dialog.Dialog bind:open={deleteOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'destructive' }) + ''}>
		<span class="text box-border overflow-hidden font-semibold leading-normal"
			>Slet al brugerinformation</span
		>
	</Dialog.Trigger>

	<Dialog.Content class="max-w-[30rem]">
		<Dialog.Title>Er du sikker på, at du vil slette alt din brugerinformation?</Dialog.Title>
		<Dialog.Description
			>Dette sletter din profil, inklusive al direkte tilknyttet information. Du vil herefter ikke
			kunne genskabe nogen af dine dokumenter, noter, kalenderbegivenheder, preferencer og mere.
			Dette inkluderer dog IKKE dokumenter, noter, eller anden slags information som du har delt
			eller som er ejet af en anden person.</Dialog.Description
		>
		<div class="flex w-full gap-2">
			<Button variant="outline" class="flex-1" on:click={() => (deleteOpen = false)}>Nej</Button>
			<Button variant="destructive" class="flex-1" on:click={deleteProfile}>Slet</Button>
		</div>
	</Dialog.Content>
</Dialog.Dialog>
