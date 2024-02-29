<script lang="ts">
	import type { NodeViewProps } from '@tiptap/core';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { CalendarClock, CalendarIcon, Users } from 'lucide-svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
	import { Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { Calendar } from '@/components/ui/calendar';
	import {
		DateFormatter,
		getLocalTimeZone,
		type DateValue,
		CalendarDate,
		today
	} from '@internationalized/date';
	import { Input } from '@/components/ui/input';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// This will set the date to tomorrow
	let date: DateValue = today(getLocalTimeZone()).add({ days: 1 });
</script>

<NodeViewWrapper>
	<div class="cont grid">
		<div>
			<CalendarClock size="18"></CalendarClock>
			<p>Afleveringsfrist</p>
		</div>

		<div class="flex">
			<Popover openFocus>
				<PopoverTrigger asChild let:builder>
					<Button
						variant={'ghost'}
						class={cn(
							'w-auto justify-start px-2 py-1 text-left text-base font-normal',
							!date && 'text-muted-foreground'
						)}
						builders={[builder]}
					>
						{#if date}
							{df.format(date.toDate(getLocalTimeZone()))}
						{:else}
							<span>Vælg dato</span>
						{/if}
					</Button>
				</PopoverTrigger>
				<PopoverContent class="w-auto p-0">
					<Calendar bind:value={date} initialFocus />
				</PopoverContent>
			</Popover>
			<p>kl.</p>
			<Input type="time" class="h-full w-24 border-none text-base"></Input>
		</div>
		<div>
			<Users size="18"></Users>
			<p>Tildelte</p>
		</div>
		<Button
			variant={'ghost'}
			class={cn(
				'w-[280px] justify-start px-2 py-1 text-left text-base font-normal text-muted-foreground'
			)}
		>
			Ingen
		</Button>
	</div>
</NodeViewWrapper>

<style>
	.cont {
		grid-template-columns: 10rem 1fr;
		column-gap: 1rem;
	}

	.cont p {
		font-weight: 500;
		color: var(--color-text-1-t);
	}

	.cont div {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.time-input {
		width: 1.5rem;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
