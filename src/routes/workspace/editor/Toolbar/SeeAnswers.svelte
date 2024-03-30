<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { BookCopy } from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Button } from '$lib/components/ui/button';
	import { Assignment, currentFile } from '@/api/apiStore';

	let open = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'floating' }) + 'br-2 toolbar-bar flex h-full px-4 py-2'}
	>
		<BookCopy size="17" />
		<span class="text box-border overflow-hidden font-semibold leading-normal">Se Svar</span>
	</Dialog.Trigger>
	<Dialog.Content class="min-h-[15rem]">
		<Dialog.Header>
			<Dialog.Title>0/147 har svaret</Dialog.Title>
			<Dialog.Description>Der er ingen svar endnu.</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
