<script lang="ts">
	import { apiDownStore } from '@/api/apiStore';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '@/components/ui/button/button.svelte';
	import { RefreshCcw } from 'lucide-svelte';

	let open = false;
	$: open = $apiDownStore;
</script>

<Dialog.Dialog bind:open>
	<Dialog.Content class="max-w-[23rem]">
		<Dialog.Title>Oops! Det ser ud til at API'en er nede</Dialog.Title>
		<Dialog.Description
			>Det ser ud til, at vores API har besluttet at tage en kaffe-pause. Vores udviklere
			laver deres magi bag kulisserne, og platformen burde være oppe at køre igen snart! Vi undskylder for besværet og lover at få det op at køre
			igen snarest muligt. Du kan tjekke status <a href="https://akademia-status.arctix.dev/">her</a
			>.</Dialog.Description
		>
		<div class="flex w-full gap-2">
			<Button variant="outline" class="flex-1" on:click={() => (open = false)}>Luk</Button>
			<Button variant="outline" on:click={() => location.reload()} class="aspect-square px-2">
				<RefreshCcw size="14"></RefreshCcw>
			</Button>

			<!-- <Button variant="destructive" class="flex-1" on:click={deleteActiveFile}>Ja</Button> -->
		</div>
	</Dialog.Content>
</Dialog.Dialog>
