<script lang="ts">
	import { prettyTime, type CalendarEvent } from './CalendarUtils';
	export let event: CalendarEvent;
	export let calendarLength: number;
	export let calendarStart: number;
	export let color: string = '#FF3D00';

	// function that converts data to minutes since day begon
	function toMinutes(date: Date): number {
		return date.getHours() * 60 + date.getMinutes();
	}

	function getDur(event: CalendarEvent): number {
		return toMinutes(event.end) - toMinutes(event.start);
	}

	let start = toMinutes(event.start);
	let dur = getDur(event);
</script>

<div
	style:--event-color={color}
	style:--height="{(dur / calendarLength) * 100}%"
	style:--start="{((start - calendarStart) / calendarLength) * 100}%"
	class="br-2"
>
	<p class="name">{event.name}</p>
	<p class="time">
		{prettyTime(start)} - {prettyTime(toMinutes(event.end))}
	</p>
</div>

<style>
	div {
		width: 300px;
		background: color-mix(in srgb, var(--event-color) 29%, transparent);
		padding: 0.5rem 1rem;
		--event-gap: 0.25rem;
		height: calc(var(--height) - var(--event-gap));
		margin-bottom: val(--event-gap);

		border-left: solid var(--event-color) 0.4rem;
		box-sizing: border-box;

		top: var(--start);
		position: absolute;

		container-type: size;
	}

	.name {
		text-transform: capitalize;
	}

	.time {
		color: var(--color-text-2-t);
		font-size: 0.7rem;
	}

	@container (height < 2.25rem) {
		div .time {
			display: none;
		}
	}
</style>
