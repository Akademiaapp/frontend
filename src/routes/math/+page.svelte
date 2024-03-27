<script lang="ts">
	import 'mathlive';
	import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
	import MathBox from '@/components/MathBox.svelte';
	let ce = new ComputeEngine();

	const string = '\\cos\\left(1\\right)';

	const a = ce.parse((Math.round(ce.parse(string).N().value * 1000000000) / 1000000000).toString());
	const b = ce.parse('1+1');
	console.log(b.evaluate().numericValue);
</script>

<!-- <input type="text" class="m-20 bg-background p-3 text-3xl" bind:value on:keydown={handleKeyDown} /> -->
<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/mathlive/dist/mathlive-static.css" />
</svelte:head>
<div class="flex flex-col items-start gap-2 bg-background p-10">
	<MathBox />
	<MathBox />
	<MathBox />
</div>
