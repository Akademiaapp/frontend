<script lang="ts">
	import type { CalenderEvent } from './CalenderTypes';
	export let event: CalenderEvent;
	export let color: string = '#FF3D00';

	function toHoursAndMinutes(totalMinutes: number) {
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return { hours, minutes };
	}

	function prettyTime(totalMinutes: number) {
		const { hours, minutes } = toHoursAndMinutes(totalMinutes);
		return hours + ':' + minutes;
	}
</script>

<div style:--event-color={color} style:height={event.duraction + '%'} class="br-2">
	<p class="name">{event.name}</p>
	<p class="time">
		{prettyTime(event.start)} - {prettyTime(event.start + event.duraction)}
	</p>
</div>

<style lang="scss">
	div {
		width: 300px;
		background: color-mix(in srgb, var(--event-color) 29%, transparent);
		padding: 0.5rem 1rem;

		border-left: solid red 0.4rem;
		box-sizing: border-box;
	}

	.name {
		text-transform: capitalize;
		font-size: 1.2rem;
	}

	.time {
		color: var(--color-text-2);
		font-size: 0.7rem;
	}
</style>
