<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import api from '@/api';
	import { selectedSchoolId, userType } from '../onboardingStores';

	let isLoading = true;

	onMount(async () => {
		if ($userType === 'TESTER') {
			$selectedSchoolId = '0a6d3842-0ac6-489d-b7ce-3dc298ff30c4';
		} 
		console.log('userType: ', $userType);
		await api.callApi('/users/self', { type: $userType }, 'PUT');
		console.log('selectedSchoolId: ', $selectedSchoolId);
		await api.callApi('/users/self', { schoolId: $selectedSchoolId }, 'PUT');
		await new Promise((resolve) => setTimeout(resolve, 1000));

		isLoading = false;
		await new Promise((resolve) => setTimeout(resolve, 1000));
		goto('/workspace/home/guide');
	});
</script>

<div class="loading-container">
	{#if isLoading}
		<div class="wrapper" out:fly={{ y: -200, delay: 0, duration: 1500, easing: cubicOut }}>
			<div class="spinner"></div>
			<h1>Loader...</h1>
		</div>
	{:else}
		<div class="wrapper">
			<h1 in:fly={{ y: 200, delay: 500, duration: 1500, easing: cubicOut }}>Klar!</h1>
			<h3 in:fly={{ y: 400, delay: 530, duration: 1650, easing: cubicOut }}>
				Sender dig til fantastiske ting!
			</h3>
		</div>
	{/if}
</div>

<style>
	.loading-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		flex-direction: column;
		gap: 20px;
	}

	.spinner {
		width: 50px;
		height: 50px;
		border: 3px solid rgba(0, 0, 0, 0.1);
		border-left-color: var(--primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.wrapper {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 25px;
	}

	h1 {
		padding-bottom: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
