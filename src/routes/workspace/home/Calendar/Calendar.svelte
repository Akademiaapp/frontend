<script lang="ts">
	import { prettyTime, type CalendarEvent } from './CalendarUtils';
	import Event from './Event.svelte';

	let events: CalendarEvent[] = [
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

	const calendarStart = 8 * 60;
	const calendarEnd = 16 * 60;
	const calendarLength = calendarEnd - calendarStart;

	const timeStamps: number[] = [];

	for (let t = calendarStart; t < calendarEnd; t += 60) {
		timeStamps.push(t);
	}
</script>

<div class="frontground br-2 floating-panel">
	<h2>Kalender</h2>
	<div class="calendar">
		<div class="time-stamps">
			{#each timeStamps as timeStamp}
				<p>{prettyTime(timeStamp)}</p>
			{/each}
		</div>
		<div class="events">
			{#each events as event}
				<Event {event} {calendarLength} {calendarStart} color={colors[event.name] || '#8b65fc'}
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
	}

	.calendar {
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
