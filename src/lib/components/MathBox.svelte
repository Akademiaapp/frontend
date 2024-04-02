<script lang="ts">
	import { onMount } from 'svelte';
	import nerdamer from 'nerdamer-41fb3b2/all';
	import 'mathlive';
	import { ComputeEngine } from '@cortex-js/compute-engine';
	import { convertLatexToMarkup, MathfieldElement, convertLatexToAsciiMath, makeSharedVirtualKeyboard } from 'mathlive';
	import { NodeViewContent } from 'svelte-tiptap';
	import { HelpCircleIcon } from 'lucide-svelte';
	import { editor } from '../../routes/workspace/editor/editorStore';
	import { Assignment, AssignmentAnswer, AssignmentProgress, currentFile } from '@/api/apiStore';
	export let value = '';
	export let expression;

	function isEquation(str): boolean {
		const pattern = /[^=]*[a-z]+[^=]*=[^=]+|[^=]+=[^=]*[a-z]+[^=]*/;
		return pattern.test(str);
	}

	let isEq = false;

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
		console.log(event);
		if (event.data === 'insertLineBreak') {
			document.querySelector('.tiptap').focus({ preventScroll: true });
			$editor.commands.setTextSelection($editor.state.selection.$to.pos);
			$editor.commands.enter();
		}

		if (!mf || !mf.expression) return;
		console.log('mf: ', mf);
		value = mf.value;
		console.log('value: ', value);
		nerdamer.set('SOLUTIONS_AS_OBJECT', true);

		const r = mf.expression.evaluate();

		if (r.isValid) {
			latexResult = r.latex;

			try {
				isEq = isEquation(value);
				if (isEq) {
					const letter = findFirstLowerCaseSymbol(value);
					console.log(convertLatexToAsciiMath(value));
					const nv = nerdamer.solveEquations([convertLatexToAsciiMath(value)]);
					console.log(nv.x);

					numResult = Object.entries(nv)
						.map(([k, v]) => k + ' = ' + v)
						.join(', ');
				} else {
					const nv = nerdamer(convertLatexToAsciiMath(value)).evaluate();
					console.log(+nv);
					if (+nv) {
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
		try {
			setTimeout(() => {
				handleKeyDown({ data: '' });
			}, 1);
		} catch (e) {
			console.error(e);
		}

		const mathVirtualKeyboard = makeSharedVirtualKeyboard();

		mf.mathVirtualKeyboardPolicy = "manual";
		mf.addEventListener("focusin", () =>  {if (editable) {mathVirtualKeyboard.show()}});
		mf.addEventListener("focusout", () =>  {if (editable) {mathVirtualKeyboard.hide()}});

		mf.addEventListener('input', handleKeyDown);

		mf.addEventListener('move-out', (event) => {
			console.log('move-out', event.detail.direction);

			event.preventDefault();

			document.querySelector('.tiptap').focus({ preventScroll: true });
			if (event.detail.direction === 'forward') {
				$editor.commands.setTextSelection($editor.state.selection.$to.pos);
			}
			if (event.detail.direction === 'backward') {
				$editor.commands.setTextSelection($editor.state.selection.$from.pos);
			}
		});

		// 	console.log('dhdh');
		// 	const { key } = event;
		// 	const target = event.target as HTMLInputElement;
		// 	console.log(mf.selection);

		// 	console.log(
		// 		'key',
		// 		key,
		// 		'selectionStart',
		// 		selectionStart,
		// 		'selectionEnd',
		// 		selectionEnd,
		// 		'value',
		// 		value
		// 	);

		// 	if (
		// 		(key === 'ArrowLeft' && selectionStart === 0) ||
		// 		(key === 'ArrowRight' && selectionEnd === value.length)
		// 	) {
		// 		console.log('Attempted to move outside the input');
		// 	}
		// });
	});

	export let latexResult = null;
	export let numResult = null;

	let editable = true;
	$: if (($currentFile instanceof AssignmentAnswer && $currentFile.progress === AssignmentProgress.SUBMITTED) || ($currentFile instanceof AssignmentAnswer && $currentFile.progress === AssignmentProgress.GRADED) || $currentFile instanceof Assignment && $currentFile.isPublic) editable = false;

	let oldRes;

	let cont;
</script>

<!-- <input type="text" class="m-20 bg-background p-3 text-3xl" bind:value on:keydown={handleKeyDown} /> -->

<button class="cursor-auto overflow-hidden rounded-sm border bg-background pr-2" bind:this={cont}>
	<math-field
		virtual-keyboard-mode="onfocus"
		virtual-keyboard-theme="apple"
		class={"rounded-none p-1 px-2 outline-none" + (editable ? ' focus:border-b-primary/100 border-b-2 border-b-primary/50' : '')}
		readonly={!editable}
		bind:this={mf}
	>
		<slot />
	</math-field>
	<span class="mx-auto h-full text-foreground" class:text-muted-foreground={oldRes}>
		{#if !isEq}
			<span class="ML__cmr mr-2">=</span>

			{#if latexResult != null}
				{@html convertLatexToMarkup(latexResult)}
			{/if}
			{#if numResult != undefined && numResult.toString() != latexResult.toString()}
				<span class="ML__cmr mx-2">≈</span>
				<div class="ML__latex mr-auto">{numResult}</div>
			{/if}
		{:else}
			<span class="ML__cmr mr-2">|</span>
			<div class="ML__latex mr-auto">{numResult}</div>
		{/if}
	</span>
</button>
