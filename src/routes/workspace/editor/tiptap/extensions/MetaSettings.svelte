<script lang="ts">
	import MemberSearch from './MemberSearch.svelte';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { CalendarClock, Users } from 'lucide-svelte';
	import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
	import { Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { Calendar } from '@/components/ui/calendar';
	import {
		DateFormatter,
		getLocalTimeZone,
		type DateValue,
		CalendarDate
	} from '@internationalized/date';
	import { Input } from '@/components/ui/input';
	import { canEditFile, currentFile } from '@/api/apiStore';
	import type { Tables } from '@/supabase.types';
	import { assignments } from '@/supabase/supabaseClient';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// This will set the date to tomorrow
	let jsDate = new Date(($currentFile as Tables<'assignment'>).due_date);
	let [hours, minutes] = jsDate
		.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })
		.split('.');
	let time = `${hours}:${minutes}`;

	let date: DateValue = new CalendarDate(
		jsDate.getFullYear(),
		jsDate.getMonth() + 1,
		jsDate.getDate()
	) as DateValue;

	function getDateWithTime(date: DateValue, time: string) {
		const [hours, minutes] = time.split(':').map(Number);
		return new Date(date.toDate(getLocalTimeZone()).setHours(hours, minutes));
	}

	$: if ($currentFile)
		assignments.update($currentFile.id, { due_date: getDateWithTime(date, time).toISOString() });

	let editable = true;
	$: editable = canEditFile($currentFile);

	// $: $currentFile.updateInfo({
	// 	due_date: date.toDate(getLocalTimeZone()).setHours().toISOString()
	// });
	let calenderOpen = false;
</script>

<NodeViewWrapper>
	<div class="cont grid">
		<div>
			<CalendarClock size="18"></CalendarClock>
			<p>Afleveringsfrist</p>
		</div>

		<div class="flex">
			<Popover openFocus bind:open={calenderOpen}>
				<PopoverTrigger asChild let:builder>
					<Button
						variant={'ghost'}
						class={cn(
							'w-auto justify-start px-2 py-1 text-left text-base font-normal',
							!date && 'text-muted-foreground'
						)}
						builders={[builder]}
						disabled={!editable}
					>
						{#if date}
							{df.format(date.toDate(getLocalTimeZone()))}
						{:else}
							<span>Vælg dato</span>
						{/if}
					</Button>
				</PopoverTrigger>
				<PopoverContent class="w-auto p-0">
					<Calendar
						bind:value={date}
						weekStartsOn={1}
						initialFocus
						onValueChange={() => (calenderOpen = false)}
						preventDeselect
					/>
				</PopoverContent>
			</Popover>
			<p class="pl-3">kl.</p>
			<Input
				type="time"
				disabled={!editable}
				class="h-full w-40 cursor-pointer border-none px-1 text-base"
				bind:value={time}
			></Input>
		</div>
		<div>
			<Users size="18"></Users>
			<p>Tildelte</p>
		</div>
		<MemberSearch bind:editable />
		<!-- <Button
			variant={'ghost'}
			class={cn(
				'w-[280px] justify-start px-2 py-1 text-left text-base font-normal text-muted-foreground'
			)}
		>
			Ingen
		</Button> -->
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
</style>
