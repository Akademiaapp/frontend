<script>
	import { goto } from '$app/navigation';

	// import { type TourGuideOptions } from '@sjmc11/tourguidejs/src/core/options.ts';
	import { TourGuideClient } from '@sjmc11/tourguidejs/src/Tour'; // JS
	import { onMount } from 'svelte';

	const steps = [
		{
			title: 'Velkommen til Akademia!',
			content: 'Dette er en guide for at hjælpe dig i gang.',
			order: 0
		},
		{
			target: '.sidebar',
			title: 'Sidebaren',
			content: 'Sidebaren giver dig et hurtigt overblik over alle dine filer og funktioner.',
			order: 1
		},
		{
			target: '#quick-bar',
			title: 'Quick Actions',
			content: 'Her har du adgang til de vigtiste funktioner, som dashboarded, søge og timeren.',
			order: 2
		},
		{
			target: '#overview',
			title: 'Oversigt',
			content: 'Her kan du se dine afleveringe og aktive filer og noter.',
			order: 3
		},
		{
			target: '#calendar',
			title: 'Kalender',
			content: 'Her kan du se dine lektioner og andre begivenheder.',
			order: 4
		}
	];

	onMount(() => {
		const tg = new TourGuideClient({});
		tg.refresh();
		tg.addSteps(steps);

		tg.onAfterExit(() => {
			goto('/workspace/home');
		});

		tg.start(); // Start the tour
	});
</script>
