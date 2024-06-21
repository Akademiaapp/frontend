<script lang="ts">
	import { assignmentAnswerStore, currentFile } from '@/api/apiStore';
	import { Assignment, AssignmentAnswer } from '@/api/fileClasses';
	import Button from '@/components/ui/button/button.svelte';
	import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
	import SelectTrigger from '@/components/ui/select/select-trigger.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { Send } from 'lucide-svelte';
	import { answer } from '../../../editor/editorStore';
	import api from '@/api';
	import { onDestroy, onMount } from 'svelte';
	import ChatMessage from './ChatMessage.svelte';
	import Card from '@/components/ui/card/card.svelte';

	onMount(() => {
		grade = null;
		// document.getElementById('feedback').value = '';
	});

	const karakter = ['0', '02', '4', '7', '10', '12'];

	let file = null;

	$: if (!$answer) setAnswer($currentFile);

	$: if ($answer) setAnswer($answer);

	function setAnswer(answer) {
		if (!answer) return;
		if (answer instanceof AssignmentAnswer) {
			file = answer;
			return;
		}
		api.getAssignmentAnswer(answer).then((res) => {
			res.json().then((data) => {
				file = new AssignmentAnswer(data, assignmentAnswerStore);
			});
		});
	}

	let error = false;

	async function sendFeedback(the_file: AssignmentAnswer, grade: number, feedback: string) {
		if (!the_file || !grade || !feedback) {
			error = true;
			console.log(error);
			setTimeout(() => {
				error = false;
				console.log(error);
			}, 2000);
			return;
		}
		file = new AssignmentAnswer(
			await (await the_file.setGrade(grade, feedback)).json(),
			assignmentAnswerStore
		);

		msg = '';
	}

	let grade = null;

	let msg = '';

	let placeholder = 'Giv feedback til opgaven...';

	$: placeholder =
		$currentFile instanceof Assignment ? 'Giv feedback til opgaven...' : 'Skriv en besked...';

	let bigInputBox = false;

	$: bigInputBox = file && !file.grade && $currentFile instanceof Assignment;
</script>

{#if !file}
	<p>loading...</p>
{:else if file instanceof AssignmentAnswer}
	<div class="flex h-full flex-col justify-between text-lg">
		<div class="flex flex-col gap-2 p-5">
			<div class="flex flex-col gap-1"></div>
			{#if file.grade !== null && file.grade !== undefined}
				<ChatMessage senderName="Lærer" tags={['Feedback']} message={file.feedback} />
				<Card class="grid aspect-square w-[4.5rem] place-items-center p-4 text-3xl font-semibold"
					>{file.grade}</Card
				>
			{:else}
				<p class="text-muted-foreground">Ingen feedback endnu</p>
			{/if}
		</div>

		<div
			class="flex border-t-2 border-border bg-background pt-1 shadow-2xl shadow-black/40 drop-shadow-sm"
		>
			<Textarea
				autoresize={true}
				{placeholder}
				class={'sidebar-scroll max-h-[16rem] resize-none border-none bg-transparent text-lg !ring-0 !ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 ' +
					(bigInputBox ? 'min-h-[10rem]' : 'h-1 min-h-full')}
				id="feedback"
				bind:value={msg}
				rows={1}
			/>
			<div class="flex flex-col justify-between gap-1 p-2">
				{#if bigInputBox}
					<Select>
						<SelectTrigger noArrow class="flex w-10 overflow-hidden">
							<SelectValue placeholder={file.grade ? file.grade.toString() : '??'} />
						</SelectTrigger>
						<SelectContent class="!w-[70px]">
							{#each karakter as k}
								<SelectItem value={k} on:click={() => (grade = k)}>{k}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				{/if}
				<Button
					class={'aspect-square h-auto p-2 text-muted-foreground transition-all hover:text-foreground' +
					error
						? ''
						: ' text-red-500'}
					variant={error ? 'destructive' : 'ghost'}
					disabled={!msg || !grade}
					on:click={async () => {
						await sendFeedback(file, grade, msg);
					}}
				>
					<Send size="20" class="fill-current " />
				</Button>
			</div>
		</div>
	</div>
{/if}
