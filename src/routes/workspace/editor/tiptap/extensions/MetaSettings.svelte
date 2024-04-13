<script lang="ts">
	import MemberSearch from './MemberSearch.svelte';
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
	} from '@internationalized/date';
	import { Input } from '@/components/ui/input';
	import { currentFile } from '@/api/apiStore';
	import { Assignment, AssignmentAnswer, AssignmentProgress } from '@/api/fileClasses';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// This will set the date to tomorrow
	let jsDate = new Date(($currentFile as Assignment).due_date);
	console.log(($currentFile as Assignment).due_date);
	let [hours, minutes] = jsDate
		.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })
		.split('.');
	let time = `${hours}:${minutes}`;

	console.log(time);
	console.log(jsDate);
	console.log(jsDate.getFullYear(), jsDate.getMonth(), jsDate.getDate());
	let date: DateValue = new CalendarDate(
		jsDate.getFullYear(),
		jsDate.getMonth() + 1,
		jsDate.getDate()
	);

	function getDateWithTime(date: DateValue, time: string) {
		const [hours, minutes] = time.split(':').map(Number);
		return new Date(date.toDate(getLocalTimeZone()).setHours(hours, minutes));
	}

	$: console.log(getDateWithTime(date, time).toISOString());
	$: $currentFile.updateInfo({ due_date: getDateWithTime(date, time).toISOString() });

	$: console.log(time);

	let editable = true;
	$: editable =
		($currentFile instanceof AssignmentAnswer &&
			$currentFile.progress === AssignmentProgress.SUBMITTED) ||
		($currentFile instanceof AssignmentAnswer &&
			$currentFile.progress === AssignmentProgress.GRADED) ||
		($currentFile instanceof Assignment && $currentFile.isPublic === false);

	// $: $currentFile.updateInfo({
	// 	due_date: date.toDate(getLocalTimeZone()).setHours().toISOString()
	// });
	let calenderOpen = false;
	$: console.log('editable', editable, $currentFile);
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
