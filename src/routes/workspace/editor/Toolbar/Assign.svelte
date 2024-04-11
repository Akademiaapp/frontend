<script lang="ts">
	import Switch from './../../../../lib/components/ui/switch/switch.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { BookCopy } from 'lucide-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Button } from '$lib/components/ui/button';
	import { currentFile, userInfo } from '@/api/apiStore';
	import { Assignment } from '@/api/fileClasses';
	import Label from '@/components/ui/label/label.svelte';

	let open = false;

	async function assignCurrentFile() {
		if ($currentFile instanceof Assignment) {
			if (asignSelf)
				await $currentFile.updateInfo({
					asigned_users_ids: [$userInfo.id]
				});
			await $currentFile.assign();
			$currentFile.isPublic = true;
		}
		open = false;
	}

	let asignSelf = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={buttonVariants({ variant: 'floating' }) +
			'br-2 toolbar-bar flex h-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/80'}
	>
		<BookCopy size="17" />
		<span class="text box-border overflow-hidden font-semibold leading-normal">Tildel</span>
	</Dialog.Trigger>
	<Dialog.Content class="min-h-[15rem]">
		<Dialog.Header>
			<Dialog.Title>Tildel '{$currentFile?.name || ''}'?</Dialog.Title>
			<Dialog.Description>
				Dette vil gøre det muligt for de tildelte personer at se og besvare opgaven.
			</Dialog.Description>
			<div class="flex items-center gap-2 pt-3">
				<Switch bind:value={asignSelf}></Switch>
				<Label for="airplane-mode">Tildel også til mig selv</Label>
			</div>
		</Dialog.Header>
		<div class="flex w-full items-end gap-2">
			<Button variant="outline" class="flex-1" on:click={() => (open = false)}>Nej</Button>
			<Button class="flex-1" on:click={assignCurrentFile}>Ja, tildel</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
