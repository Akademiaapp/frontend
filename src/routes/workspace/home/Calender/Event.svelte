<script lang="ts">
	import { prettyTime, type CalenderEvent } from './CalenderUtils';
	export let event: CalenderEvent;
	export let calenderLength: number;
	export let calenderStart: number;
	export let color: string = '#FF3D00';
</script>

<div
	style:--event-color={color}
	style:--height="{(event.duraction / calenderLength) * 100}%"
	style:--start="{((event.start - calenderStart) / calenderLength) * 100}%"
	class="br-2"
>
	<p class="name">{event.name}</p>
	<p class="time">
		{prettyTime(event.start)} - {prettyTime(event.start + event.duraction)}
	</p>
</div>

<style>
	div {
		width: 300px;
		background: color-mix(in srgb, var(--event-color) 29%, transparent);
		padding: 0.5rem 1rem;
		--cal-gap: 0.25rem height: calc(var(--height) - var(var(--cal-gap)));
		margin-bottom: val(--cal-gap);

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
