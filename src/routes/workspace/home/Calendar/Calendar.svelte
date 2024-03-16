<script lang="ts">
	import { prettyTime, type CalendarEvent } from './CalendarUtils';
	import Event from './Event.svelte';

	// https://akademia-api.arctix.dev
	// https://aula-api.arctix.dev/getCalendarEventsUsingUnilogin

	async function sendRequest() {
		const username = sessionStorage.getItem('username');
		const password = sessionStorage.getItem('password');

		if (!username || !password) return; //

		if (username == '' || password == '') {
			console.log('username or password is empty');
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

			for (let i = 0; i < events.length - 1; i++) {
				if (events[i].x == '50%') continue;
				let j = 1;

				console.log('checking overlap' + events[i].name + ' ' + events[i + j].name);

				while (events[i].end > events[i + j].start) {
					events[i + j].x = '50%';
					console.log('overlap' + events[i].name + ' ' + events[i + j].name);
					j++;
				}
			}

			// No overlapping events
			return events;
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
				name: event.title,
				start: new Date(event.startDateTime),
				end: new Date(event.endDateTime)
			};
		});

		events = checkOverlap(result);

		const todayEvents = events.filter((event) => isToday(event.start));
		console.log('Number of events happening today:', todayEvents.length);
		console.log(todayEvents);

		return;

		const response = await fetch('', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (response.ok) {
			// Handle successful response
			const result = await response.json();
			console.log(result);

			events = result.map((event) => {
				return {
					name: event.title,
					start: new Date(event.startDateTime),
					end: new Date(event.endDateTime)
				};
			});
			events = result;
		} else {
			// Handle error response
			console.error('Error:', response.status);
		}
	}

	import { onMount } from 'svelte';

	onMount(sendRequest);

	let events: CalendarEvent[] = [
		{
			name: 'dansk',
			start: new Date(new Date().setHours(8, 0, 0, 0)),
			end: new Date(new Date().setHours(8, 45, 0, 0))
		},
		{
			name: 'matematik',
			start: new Date(new Date().setHours(8, 45, 0, 0)),
			end: new Date(new Date().setHours(10, 15, 0, 0))
		},
		{
			name: 'engelsk',
			start: new Date(new Date().setHours(new Date().getHours() - 14 - 24)),
			end: new Date(new Date().setHours(10, 15, 0, 0))
		},
		{
			name: 'dansk',
			start: new Date(new Date().setHours(10, 15, 0, 0)),
			end: new Date(new Date().setHours(11, 0, 0, 0))
		},
		{
			name: 'klasse fest',
			start: new Date(new Date().setHours(15, 0, 0, 0)),
			end: new Date(new Date().setHours(16, 0, 0, 0))
		}
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

	function isToday(date) {
		const today = new Date();
		today.setDate(today.getDate() - 1);
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
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
			{#each events.filter((event) => isToday(event.start)) as event}
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
