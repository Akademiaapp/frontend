<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { BookUp } from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Button } from '$lib/components/ui/button';
	import { currentFile } from '@/api/apiStore';
	import { assignmentAnswers } from '@/supabase/supabaseClient';

	let open = false;

	async function submit() {
		// $currentFile.updateInfo({ status: 'SUBMITTED' });
		if ('status' in $currentFile) {
			$currentFile.status = 'submitted';

			assignmentAnswers.update($currentFile.id, { status: 'submitted' });
		}
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'floating' }) + 'br-2 toolbar-bar flex h-full px-4 py-2'}
	>
		<BookUp size="17" />
		<span class="text box-border overflow-hidden font-semibold leading-normal">Aflever</span>
	</Dialog.Trigger>
	<Dialog.Content class="min-h-[15rem]">
		<Dialog.Header>
			<Dialog.Title>Aflever opgaven</Dialog.Title>
			<Dialog.Description
				>Læreren vil få omgående adgang til dit dokument og mulighed for at give dig feedback</Dialog.Description
			>
			<div class="flex-1"></div>
			<div class="flex w-full items-end gap-2">
				<Button variant="outline" class="flex-1" on:click={() => (open = false)}>Nej</Button>
				<Button class="flex-1" on:click={submit}>Ja, aflever</Button>
			</div>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
