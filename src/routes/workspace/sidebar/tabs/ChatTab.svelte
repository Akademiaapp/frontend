<script>
	import { Assignment, AssignmentAnswer, currentFile } from '@/api/apiStore';
	import Button from '@/components/ui/button/button.svelte';
	import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
	import SelectTrigger from '@/components/ui/select/select-trigger.svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { Send } from 'lucide-svelte';
	import { answer } from '../../editor/editorStore';
	import api from '@/api';
	import { onMount } from 'svelte';

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
</script>

{#if !file}
	<p>loading...</p>
{:else}
	<div class="flex h-full flex-col justify-between">
		{#if (file instanceof AssignmentAnswer) }
			<div class="p-5">
				<h1 class="mb-1">Feedback:</h1>
				<h2>Karakter: {file.grade}</h2>
				<p>{file.feedback}</p>
			</div>
		{/if}

		<div class="flex gap-1 p-3">
			<Textarea placeholder="Giv feedback til opgaven" class="resize-none text-lg" />
			<div class="flex flex-col justify-evenly gap-1">
				<Select>
					<SelectTrigger noArrow class="flex w-10 overflow-hidden">
						<SelectValue placeholder="??" />
					</SelectTrigger>
					<SelectContent class="!w-[70px]">
						{#each karakter as k}
							<SelectItem value={k}>{k}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
				<Button
					class="h-auto p-2 text-muted-foreground transition-all hover:text-foreground"
					variant="ghost"
				>
					<Send size="20" class="fill-current " />
				</Button>
			</div>
		</div>
	</div>
{/if}