<script>
	import FileList from './FileList.svelte';

	export let name;
	export let folders = [];
	export let files = [];

	export let open = true;
</script>

<button
	class="br-1 -mb-0.5 mt-0.5 w-auto self-start px-3 py-0.5 text-sm font-semibold text-muted-foreground hover:bg-muted/50"
	on:click={() => (open = !open)}
	>{name}
</button>

{#if open}
	<FileList {folders} {files}></FileList>
{/if}
