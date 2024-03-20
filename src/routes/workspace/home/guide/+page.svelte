<script>
	// import { type TourGuideOptions } from '@sjmc11/tourguidejs/src/core/options.ts';
	import { TourGuideClient } from '@sjmc11/tourguidejs/src/Tour'; // JS

	const tg = new TourGuideClient({});

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
			content: 'Her kan du se dine Afleveringe og aktive filer',
			order: 3
		},
		{
			target: '#calendar',
			title: 'Kalender',
			content: 'Her kan du se dine lektioner og andre begivenheder.',
			order: 4
		}
	];
	tg.addSteps(steps);

	console.log(steps);

	tg.start(); // Start the tour

	console.log('hi');
</script>
