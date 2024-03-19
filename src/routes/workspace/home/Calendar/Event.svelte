<script lang="ts">
	import { prettyTime, type CalendarEvent } from './CalendarUtils';
	export let event: CalendarEvent;
	export let calendarLength: number;
	export let calendarStart: number;
	export let color: string = '#FF3D00';
</script>

<div
	style:--event-color={color}
	style:--height="{(event.duraction / calendarLength) * 100}%"
	style:--start="{((event.start - calendarStart) / calendarLength) * 100}%"
	class="br-2"
>
	<p class="name">{event.name}</p>
	<p class="time">
		{prettyTime(event.start)} - {prettyTime(event.start + event.duraction)}
	</p>
</div>

<style>
	div {
		width: 100%;
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
