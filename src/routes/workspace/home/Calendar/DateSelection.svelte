<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		CalendarDate,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue = today(getLocalTimeZone());

	export let date = value.toDate(getLocalTimeZone());

	$: date = value.toDate(getLocalTimeZone());

	const moveDays = (days: number) => () => {
		value = value.add({ days: days });
	};
</script>

<div class="flex gap-2">
	<Button variant="outline" size="icon" on:click={moveDays(-1)}>
		<ChevronLeft></ChevronLeft>
	</Button>
	<Popover.Root>
		<Popover.Trigger asChild let:builder>
			<Button
				variant="outline"
				class={cn(' justify-start text-left font-normal', !value && 'text-muted-foreground')}
				builders={[builder]}
			>
				{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar bind:value weekStartsOn={1} initialFocus />
		</Popover.Content>
	</Popover.Root>
	<Button variant="outline" size="icon" on:click={moveDays(1)}>
		<ChevronRight></ChevronRight>
	</Button>
</div>
