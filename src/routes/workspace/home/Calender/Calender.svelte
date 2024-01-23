<script lang="ts">
	import { prettyTime, type CalenderEvent } from './CalenderUtils';
	import Event from './Event.svelte';

	let events: CalenderEvent[] = [
		{ name: 'dansk', start: 8 * 60, duraction: 45 },
		{ name: 'matematik', start: 8 * 60 + 45, duraction: 45 * 2 },
		{ name: 'engelsk', start: 8 * 60 + 45 * 3, duraction: 45 },
		{ name: 'dansk', start: 8 * 60 + 45 * 4, duraction: 45 },
		{ name: 'klasse fest', start: 15 * 60, duraction: 1 * 60 }
	];

	// map each type of event to a specific color
	const colors: Record<string, string> = {
		dansk: '#FF3D00',
		matematik: '#349BEB',
		engelsk: '#f5ce42'
	};

	const calenderStart = 8 * 60;
	const calenderEnd = 16 * 60;
	const calenderLength = calenderEnd - calenderStart;

	const timeStamps: number[] = [];

	for (let t = calenderStart; t < calenderEnd; t += 60) {
		timeStamps.push(t);
	}
</script>

<div class="frontground br-2 floating-panel">
	<h2>Calender</h2>
	<div class="calender">
		<div class="time-stamps">
			{#each timeStamps as timeStamp}
				<p>{prettyTime(timeStamp)}</p>
			{/each}
		</div>
		<div class="events">
			{#each events as event}
				<Event {event} {calenderLength} {calenderStart} color={colors[event.name] || '#8b65fc'}
				></Event>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.frontground {
		flex-direction: column;
		padding: 1rem;
		display: flex;
		gap: 1rem;
	}

	.calender {
		display: flex;
		height: 100%;
	}

	.time-stamps {
		display: grid;
		grid-template-columns: repeat(1fr, 100);
		margin-right: 0.5rem;

		text-align: right;
	}

	.events {
		position: relative;
		width: 300px;
	}
</style>
