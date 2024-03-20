<script>
	// import { type TourGuideOptions } from '@sjmc11/tourguidejs/src/core/options.ts';
	import { TourGuideClient } from '@sjmc11/tourguidejs/src/Tour'; // JS

	const tg = new TourGuideClient({});

	tg.addSteps([
		{
			title: 'Velkommen til Akademia!',
			content: 'Dette er en guide for at hjælpe dig i gang.'
		},
		{
			target: '.sidebar',
			title: 'Sidebaren',
			content: 'Sidebaren giver dig et hurtigt overblik over alle dine filer og funktioner.'
		},
		{
			target: '#quick-bar',
			title: 'Quick Actions',
			content: 'Her har du adgang til de vigtiste funktioner, som dashboarded, søge og timeren.'
		},
		{
			target: '#overview',
			title: 'oversigt',
			content: 'Her kan du se dine Afleveringe og aktive filer'
		},
		{
			target: '#calendar',
			title: 'Kalender',
			content: 'Her kan du se dine lektioner og andre begivenheder.'
		}
	]);

	tg.start(); // Start the tour

	console.log('hi');
</script>
