<script lang="ts">
	import { hooks, nodes } from './../../../.svelte-kit/generated/client/app.js';
	import type { Editor } from '@tiptap/core';

	export let tiptap: Editor;

	$: console(tiptap.nodes);

	let topHeadings: String[] = [];

	console.log(topHeadings);
</script>

<div>
	{#each topHeadings as h}
		<p>{h}</p>
	{/each}
</div>
