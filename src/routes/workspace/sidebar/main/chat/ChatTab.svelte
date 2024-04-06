<script lang="ts">
	import { Assignment, AssignmentAnswer, assignmentAnswerStore, currentFile } from '@/api/apiStore';
	import Button from '@/components/ui/button/button.svelte';
	import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
	import SelectTrigger from '@/components/ui/select/select-trigger.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { Send } from 'lucide-svelte';
	import { answer } from '../../../editor/editorStore';
	import api from '@/api';
	import { onMount } from 'svelte';
	import ChatMessage from './ChatMessage.svelte';
	import Card from '@/components/ui/card/card.svelte';
	import TextareaAutosize from '@/components/TextareaAutosize.svelte';

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
				file = new AssignmentAnswer(data);
			});
		});
	}

	async function sendFeedback(the_file: AssignmentAnswer, grade: number, feedback: string) {
		if (!the_file || !grade || !feedback) return;
		file = new AssignmentAnswer(await (await the_file.setGrade(grade, feedback)).json());
	}

	let grade = null;

	let msg = '';
</script>

{#if !file}
	<p>loading...</p>
{:else if file instanceof AssignmentAnswer}
	<div class="flex h-full flex-col justify-between text-lg">
		<div class="flex flex-col gap-2 p-5">
			<div class="flex flex-col gap-1"></div>
			<ChatMessage senderName="Lærer" tags={['Feedback']} message={file.feedback} />
			<Card class="w-17 grid aspect-square place-items-center p-4 text-3xl font-semibold"
				>{file.grade}</Card
			>
		</div>

		<div
			class="flex border-t-2 border-border bg-background pt-1 shadow-2xl shadow-black/40 drop-shadow-sm"
		>
			<TextareaAutosize
				placeholder={'Giv feedback til opgaven...'}
				class={'sidebar-scroll max-h-[16rem] resize-none border-none bg-transparent text-lg !ring-0 !ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0' +
					(file.grade ? 'h-1 min-h-full' : 'min-h-[9rem]')}
				id="feedback"
				bind:value={msg}
				rows={file.grade ? 1 : 5}
			/>
			<div class="flex flex-col justify-between gap-1 p-2">
				{#if !file.grade}
					<Select>
						<SelectTrigger noArrow class="flex w-10 overflow-hidden">
							<SelectValue placeholder={file.grade ? file.grade : '??'} />
						</SelectTrigger>
						<SelectContent class="!w-[70px]">
							{#each karakter as k}
								<SelectItem value={k} on:click={() => (grade = k)}>{k}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				{/if}
				<Button
					class="aspect-square h-auto p-2 text-muted-foreground transition-all hover:text-foreground"
					variant="ghost"
					on:click={async () => {
						await sendFeedback(file, grade, msg);
						msg = '';
					}}
				>
					<Send size="20" class="fill-current " />
				</Button>
			</div>
		</div>
	</div>
{/if}
