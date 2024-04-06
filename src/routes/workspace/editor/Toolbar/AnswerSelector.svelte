<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { onMount, tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { Assignment, currentFile } from '@/api/apiStore';
	import { answer } from '../editorStore';

	let answers = [] as {
		id: string;
		assignment_id: string;
		student_id: string;
		status: string;
		feedback: string;
		grade: number;
		student: {
			id: string;
			first_name: string;
			last_name: string;
			type: string;
			email: string;
		};
	}[];

	onMount(async () => {
		if (!($currentFile instanceof Assignment)) return;
		let new_answers = await $currentFile.getAnswers();
		console.log('New answers: ', new_answers);
		if (new_answers instanceof Array) answers = new_answers;
	});

	let open = false;

	$: selectedValue = $answer
		? answers.find((f) => f.id === $answer)?.student.first_name +
			' ' +
			answers.find((f) => f.id === $answer)?.student.last_name
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
		const previous_index = answers.findIndex((f) => f.id === $answer);
		if (answers[previous_index + 1]?.id !== undefined && answers.length > 1) {
			$answer = answers[previous_index + 1].id;
		} else {
			$answer = answers[0].id;
		}
	}

	function previousStudent() {
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
