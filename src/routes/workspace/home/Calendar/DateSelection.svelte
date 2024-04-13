<script lang="ts">
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
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

	let open = false;
</script>

<div class="flex gap-0.5 pt-0.5">
	<Button variant="floating" size="sm" class="h-8 w-8 p-1.5" on:click={moveDays(-1)}>
		<ChevronLeft></ChevronLeft>
	</Button>
	<Popover.Root bind:open>
		<Popover.Trigger asChild let:builder>
			<Button
				variant="floating"
				class={cn(
					' h-8 justify-start px-2 text-left font-normal',
					!value && 'text-muted-foreground',
					open && 'bg-muted/50'
				)}
				builders={[builder]}
			>
				{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar bind:value weekStartsOn={1} initialFocus preventDeselect={true} />
		</Popover.Content>
	</Popover.Root>
	<Button variant="floating" size="icon" class="h-8 w-8 p-1.5" on:click={moveDays(1)}>
		<ChevronRight></ChevronRight>
	</Button>
</div>
