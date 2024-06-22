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

	let open = false;
	
	function deleteProfile() {
		supabase.rpc('delete_user').then(() => {
			supabase.auth.signOut({ scope: 'local' }).then(() => {
				goto('/onboarding/login');
			})
		});
	}

	let school: Tables<'school'>;

	onMount(() => {
		supabase.from('school').select('*').eq('id', $userInfo.school_id).single().then(({ data }) => school = data);
	});
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

<Dialog.Dialog bind:open>
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
			<Button variant="outline" class="flex-1" on:click={() => (open = false)}>Nej</Button>
			<Button variant="destructive" class="flex-1" on:click={deleteProfile}>Slet</Button>
		</div>
	</Dialog.Content>
</Dialog.Dialog>
