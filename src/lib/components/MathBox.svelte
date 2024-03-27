<script lang="ts">
	import { onMount } from 'svelte';
	import nerdamer from 'nerdamer-41fb3b2/all';
	import 'mathlive';
	import { ComputeEngine } from 'https://unpkg.com/@cortex-js/compute-engine?module';
	import {
		convertLatexToMarkup,
		MathfieldElement,
		type Mathfield,
		convertLatexToAsciiMath
	} from 'mathlive';
	let value = '';
	let ce = new ComputeEngine();

	function isEquation(str): boolean {
		const pattern = /[^=]*[a-z]+[^=]*=[^=]+|[^=]+=[^=]*[a-z]+[^=]*/;
		return pattern.test(str);
	}

	function findFirstLowerCaseSymbol(inputString) {
		const regex = /[a-z]/; // Matches the first lowercase letter (a-z)

		const firstLowerCaseSymbol = inputString.match(regex);

		if (firstLowerCaseSymbol === null) {
			return '';
		} else {
			return firstLowerCaseSymbol[0];
		}
	}

	function handleKeyDown(event) {
		nerdamer.set('SOLUTIONS_AS_OBJECT', true);
		const r = mf.expression.evaluate();
		// console.log(nerdamer('1/PI').evaluate().value());
		if (r.isValid) {
			latexResult = r.latex;

			try {
				if (isEquation(mf.value)) {
					const letter = findFirstLowerCaseSymbol(mf.value);
					console.log(convertLatexToAsciiMath(mf.value));
					const nv = nerdamer.solveEquations([convertLatexToAsciiMath(mf.value)]).toString();
					console.log(nv);

					numResult = nv.replace(',', ' = ');
				} else {
					const nv = nerdamer.convertFromLaTeX(latexResult).evaluate();
					console.log(+nv);
					if (nv) {
						numResult = Math.round(nv * 100000) / 100000;
					} else {
						numResult = null;
					}
				}
			} catch (e) {
				numResult = null;
			}

			// } else {
			// numResult = null;
			// }
			console.log(latexResult, numResult);
			oldRes = false;
		} else {
			oldRes = true;
		}
	}
	// console.log(b.value);
	// console.log(a.latex, b.latex, 'isEqual?');
	// console.log(a.isEqual(b));
	let mf: MathfieldElement;

	onMount(() => {
		mf.addEventListener('input', handleKeyDown);
	});

	let latexResult = null;
	let numResult = null;

	let oldRes;
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
	<span class="text-foreground" class:text-muted-foreground={oldRes}>
		<span class="ML__cmr mr-4">=</span>

		{#if latexResult != null}
			{@html convertLatexToMarkup(latexResult)}
		{/if}
		{#if numResult != undefined && numResult.toString() != latexResult.toString()}
			<span class="ML__cmr mx-3">≈</span>
			<div class="ML__latex">{numResult}</div>
		{/if}
	</span>
</div>
