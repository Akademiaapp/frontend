<script lang="ts">
	import type { CalenderEvent } from './CalenderTypes';
	import Event from './Event.svelte';

	let events: CalenderEvent[] = [{ name: 'dansk', start: 8 * 60, duraction: 45 }];
</script>

<div class="frontground br-2">
	<h1>Kalender</h1>
	{#each events as event}
		<Event {event}></Event>
	{/each}
</div>

<style lang="scss">
	.frontground {
		flex-direction: column;
		padding: 1rem;
		display: flex;
		gap: 1rem;
	}
</style>
