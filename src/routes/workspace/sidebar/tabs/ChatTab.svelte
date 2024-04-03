<script>
	import { AssignmentAnswer, currentFile } from '@/api/apiStore';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
</script>

<div class="flex justify-between">
	{#if $currentFile instanceof AssignmentAnswer}
		<div class="p-5">
			<h1 class="mb-1">Feedback:</h1>
			<h2>Karakter: {$currentFile.grade}</h2>
			<p>{$currentFile.feedback}</p>
		</div>
	{/if}

	<div class="flex">
		<Textarea />
	</div>
</div>
