<script lang="ts">
	import { onMount } from 'svelte';
	import nerdamer from 'nerdamer-41fb3b2/all';
	import 'mathlive';
	import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
	import { convertLatexToMarkup, MathfieldElement, type Mathfield } from 'mathlive';
	let value = '';
	let ce = new ComputeEngine();

	function handleKeyDown(event) {
		const r = mf.expression.evaluate();

		if (r.isValid) {
			latexResult = r.latex;
			const nv: string = r.value;
			console.log(typeof nv);
			if (typeof nv === 'number') {
				numResult = Math.round(nv * 100000) / 100000;
			} else {
				numResult = null;
			}
			console.log(latexResult, numResult);
		}
	}
	
	// console.log(b.value);
	// console.log(a.latex, b.latex, 'isEqual?');
	// console.log(a.isEqual(b));
	let mf: MathfieldElement;

	onMount(() => {
		mf.focus();
		mf.addEventListener('input', handleKeyDown);
	});

	let latexResult = null;
	let numResult = null;
</script>

<!-- <input type="text" class="m-20 bg-background p-3 text-3xl" bind:value on:keydown={handleKeyDown} /> -->

	<div class="overflow-hidden rounded-lg border bg-background pr-6 text-2xl">
		<math-field
			virtual-keyboard-mode="onfocus"
			virtual-keyboard-theme="apple"
			class="rounded-none border-b-2 border-b-primary/50 p-2 px-4 outline-none focus:border-b-primary/100"
			bind:this={mf}
		>
		</math-field>

		<span class="ML__cmr mr-4">=</span>

		{#if latexResult != null}
			{@html convertLatexToMarkup(latexResult)}
		{/if}
		{#if numResult != undefined && numResult.toString() != latexResult.toString()}
			<span class="ML__cmr mx-3">≈</span>
			<div class="ML__latex">{numResult}</div>
		{/if}
	</div>
</div>
