<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { onDestroy, onMount, tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { ChevronLeft, ChevronRight, MessagesSquare } from 'lucide-svelte';
	import { currentFile } from '@/api/apiStore';
	import { answer } from '../editorStore';
	import { currentTab } from '../../sidebar/sidebarStore';
	import { assignmentAnswers, users } from '@/supabase/supabaseClient';
	import type { Tables } from '@/supabase.types';

	let answers: Tables<'assignment_answer'>[] = [];

	onMount(async () => {
		answers = $assignmentAnswers.filter((r) => r.assignment_id === $currentFile.id);
	});

	let open = false;

	$: selectedValue = $answer
		? users.find(answers.find((f) => f.id === $answer)?.student_id).full_name
		: 'Vælg en elev...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	function nextStudent() {
		if (answers.length === 0) return;
		const previous_index = answers.findIndex((f) => f.id === $answer);
		if (answers[previous_index + 1]?.id !== undefined && answers.length > 1) {
			$answer = answers[previous_index + 1].id;
		} else {
			$answer = answers[0].id;
		}
	}

	function previousStudent() {
		if (answers.length === 0) return;
		const previous_index = answers.findIndex((f) => f.id === $answer);
		if (answers[previous_index - 1]?.id !== undefined && answers.length > 1) {
			$answer = answers[previous_index - 1].id;
		} else {
			$answer = answers[answers.length - 1].id;
		}
	}
</script>

<div class="flex gap-1">
	<Button variant="outline" class="h-10 w-10 p-0" on:click={previousStudent}>
		<ChevronLeft size="24" />
	</Button>
	<Popover.Root bind:open let:ids>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="w-[200px] justify-between"
			>
				{selectedValue}
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[220px] p-0">
			<Command.Root>
				<Command.Input placeholder="Søg efter elev..." />
				<Command.Empty>Ingen elev fundet.</Command.Empty>
				<Command.Group>
					{#each answers as answerr}
						<Command.Item
							value={answerr.id}
							onSelect={(currentValue) => {
								$answer = currentValue;
								closeAndFocusTrigger(ids.trigger);
							}}
						>
							<Check class={cn('mr-2 h-4 w-4', $answer !== answerr.id && 'text-transparent')} />
							{answerr.student.first_name}
							{answerr.student.last_name}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	<Button variant="outline" class="h-10 w-10 p-0" on:click={nextStudent}>
		<ChevronRight size="24" />
	</Button>
</div>
{#if $answer && $currentTab != 'chat'}
	<Button
		class="fixed bottom-5 z-10 gap-2"
		on:click={() => {
			$currentTab = 'chat';
		}}
	>
		<MessagesSquare size="24" />
		Giv feedback
	</Button>
{/if}
