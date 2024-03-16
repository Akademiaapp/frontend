<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-svelte';
	import { prettyTime, type CalendarEvent } from './CalendarUtils';
	import Event from './Event.svelte';

	// https://akademia-api.arctix.dev
	// https://aula-api.arctix.dev/getCalendarEventsUsingUnilogin

	const titelMap = {
		MAT: 'Matematik',
		DAN: 'Dansk',
		ENG: 'Engelsk',
		KRI: 'Kristendom',
		IDR: 'Idræt',
		SAM: 'Samfundsfag',
		'F/K': 'Fysik/kemi',
		BIO: 'Biologi',
		TEK: 'Teknologi',
		MUS: 'Musik',
		BIL: 'Billedkunst',
		HIS: 'Historie',
		GEO: 'Geografi',
		TYS: 'Tysk',
		FRA: 'Fransk',
		SPN: 'Spansk',
		TIL: 'Valgfag'
	};

	let state = 'loading';

	async function sendRequest() {
		const username = sessionStorage.getItem('username');
		const password = sessionStorage.getItem('password');

		if (username == '' || password == '' || username == null || password == null) {
			state = 'missignCred';
			return;
		}

		console.log('sending request');

		const data = {
			username,
			password
		};

		const loginRes = await fetch('http://127.0.0.1:8080/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const loginData = await loginRes.json();

		console.log(loginData);

		let dd = JSON.stringify({
			login_info: loginData,
			start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
			end: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()
		});

		function checkOverlap(events) {
			// Sort events by start time
			// events.sort((a, b) => a.start - b.start);

			let eventsToDelete = [];

			for (let i = 0; i < events.length - 1; i++) {
				let j = 1;

				console.log('checking overlap' + events[i].name + ' ' + events[i + j].name);

				while (events[i].end >= events[i + j].start) {
					if (events[i].end > events[i + j].start && events[i].x != '50%') {
						events[i + j].x = '50%';
					}

					if (events[i].name == events[i + j].name) {
						eventsToDelete.push(i + j);
						events[i].end = events[i + j].end;
					}

					j++;
				}
			}

			state = 'loaded';

			// No overlapping events
			return events.filter((_, i) => !eventsToDelete.includes(i));
		}

		console.log(dd);
		const calenderRes = await fetch(
			'http://127.0.0.1:8080/getCalenderEvents',

			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: dd
			}
		);

		const calenderData = await calenderRes.json();
		console.log(calenderData);

		let result = calenderData.map((event) => {
			return {
				name: titelMap[event.title] || event.title,
				start: new Date(event.startDateTime),
				end: new Date(event.endDateTime)
			};
		});

		events = checkOverlap(result);

		return;
	}

	import { onMount } from 'svelte';

	onMount(async () => {
		try {
			await sendRequest();
			if (state == 'loading') {
				state = 'failed';
			}
		} catch (e) {
			state = 'error';
		}
	});

	let events: CalendarEvent[] = [];

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

	let today = new Date();

	function isToday(today: Date, date) {
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	}

	function moveDay(days) {
		today.setDate(today.getDate() + days);
		today = today;
		console.log(today);
		const todayEvents = events.filter((event) => isToday(today, event.start));
		console.log(todayEvents);
	}
</script>

<div class="frontground br-2 floating-panel">
	<div class="flex justify-between">
		<h2>Kalender</h2>
		<div class="flex gap-2">
			<Button
				variant="outline"
				size="icon"
				on:click={() => {
					moveDay(-1);
				}}
			>
				<ChevronLeft></ChevronLeft>
			</Button>
			<Button
				variant="outline"
				size="icon"
				on:click={() => {
					moveDay(1);
				}}
			>
				<ChevronRight></ChevronRight>
			</Button>
		</div>
	</div>
	<div class="calendar">
		<div class="time-stamps">
			{#each timeStamps as timeStamp}
				<p>{prettyTime(timeStamp)}</p>
			{/each}
		</div>
		<div class="events">
			{#if state !== 'loaded'}
				<div
					class="text-2 absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-1 font-semibold"
				>
					{#if state === 'loading'}
						<Loader2 class=" mr-2 origin-center animate-spin" />
						<p class="">Loading...</p>
					{:else if state === 'missignCred'}
						<a href="unilogin" class="text-2">Missing credentials</a>
					{:else if state === 'failed'}
						<p class="text-2">Failed to load</p>
					{/if}
				</div>
			{/if}
			{#each events.filter((event) => isToday(today, event.start)) as event (event)}
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
