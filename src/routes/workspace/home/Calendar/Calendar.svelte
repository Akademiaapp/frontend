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

	let loadedDateRange: { start: Date | null; end: Date | null } = {
		start: null,
		end: null
	};

	async function getLoginInfo() {
		const username = sessionStorage.getItem('username');
		const password = sessionStorage.getItem('password');
		if (username == '' || password == '' || username == null || password == null) {
			state = 'missignCred';
			return;
		}
		await logintoAula(username, password);
	}

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

	async function sendRequest(start, end) {
		state = 'loading';

		console.log('sending request');

		if ($loginInfo == null) {
			console.log('getting login info');
			await getLoginInfo();
		}

		let payload = {
			start: start,
			end: end
		};

		const calenderData = await fetchAula('getCalenderEvents', payload);

		console.log(calenderData);

		let result = calenderData.map((event) => {
			return {
				name: titelMap[event.title] || event.title,
				start: new Date(event.startDateTime),
				end: new Date(event.endDateTime)
			};
		});

		events = [...events, ...checkOverlap(result)];

		return;
	}

	import { onMount } from 'svelte';
	import DateSelection from './DateSelection.svelte';
	import { fetchAula, loginInfo, logintoAula } from '@/api/AulaApiStore';

	onMount(async () => {
		try {
			const start = new Date(new Date().setDate(new Date().getDate() - 7));
			const end = new Date(new Date().setDate(new Date().getDate() + 7));
			await sendRequest(start.toISOString(), end.toISOString());
			if (state == 'loading') {
				state = 'failed';
			} else {
				loadedDateRange = {
					start,
					end
				};
			}
		} catch (e) {
			state = 'failed';
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

	function checkForUpdate(today) {
		if (loadedDateRange.end == null) return;
		if (state != 'loaded') return;

		console.log(today, loadedDateRange.end, loadedDateRange.start);
		if (today < loadedDateRange.start) {
			const newStart = new Date(loadedDateRange.start);
			newStart.setDate(newStart.getDate() - 14);
			console.log(newStart, loadedDateRange.start);
			sendRequest(newStart.toISOString(), loadedDateRange.start);

			loadedDateRange.start = newStart;
		} else if (today > loadedDateRange.end) {
			const newEnd = new Date(today.setDate(loadedDateRange.end.getDate() + 14));
			sendRequest(loadedDateRange.end, newEnd.toISOString());

			loadedDateRange.end = newEnd;
		}
	}

	let today;

	$: checkForUpdate(today);

	function isToday(today: Date, date) {
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	}
</script>

<div class="frontground br-2 floating-panel">
	<div class="flex justify-between">
		<h2>Kalender</h2>
		<DateSelection bind:date={today} />
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
