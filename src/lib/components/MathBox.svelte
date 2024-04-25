<script lang="ts">
	import { onMount } from 'svelte';
	import nerdamer from 'nerdamer-prime/all';
	import 'mathlive';
	import { convertLatexToMarkup, MathfieldElement, convertLatexToAsciiMath } from 'mathlive';
	import { editor } from '../../routes/workspace/editor/editorStore';
	import { Assignment, AssignmentAnswer, AssignmentStatus } from '@/api/fileClasses';
	import { currentFile } from '@/api/apiStore';
	import { cn } from '@/utils';
	export let value = '';

	export let expression = '';
	export let onFocus = () => {};

	$: updateValue(expression);

	function updateValue(expression) {
		if (expression == value) return;
		mf?.setValue(expression);
		handleKeyDown({ data: '' });
	}

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
		if (event.data === 'delh	 eteContentBackward') {
			event.preventDefault();
		}

		if (event.data === 'insertLineBreak') {
			document.querySelector('.tiptap').focus({ preventScroll: true });
			$editor.commands.setTextSelection($editor.state.selection.$to.pos + 1);
			$editor.commands.enter();
		}

		if (!mf || !mf.expression) return;

		value = mf.value;

		nerdamer.set('SOLUTIONS_AS_OBJECT', true);

		const r = mf.expression.evaluate();

		if (r.isValid) {
			latexResult = r.latex;

			try {
				isEq = isEquation(value);
				if (isEq) {
					const letter = findFirstLowerCaseSymbol(value);
					const nv = nerdamer.solveEquations([convertLatexToAsciiMath(value)]);

					numResult = Object.entries(nv)
						.map(([k, v]) => k + ' = ' + v)
						.join(', ');
				} else {
					const nv = nerdamer(convertLatexToAsciiMath(value)).evaluate();
					if (+nv) {
						numResult = Math.round(nv * 100000) / 100000;
					} else {
						numResult = null;
					}
				}
			} catch (e) {
				numResult = null;
			}
			oldRes = false;
		} else {
			oldRes = true;
		}
	}
	let mf: MathfieldElement;

	onMount(() => {
		try {
			setTimeout(() => {
				handleKeyDown({ data: '' });
			}, 1);
		} catch (e) {
			console.error(e);
		}

		const mathVirtualKeyboard = window.mathVirtualKeyboard;

		mf.mathVirtualKeyboardPolicy = 'manual';
		mf.addEventListener('focusin', () => {
			if (editable) {
				mathVirtualKeyboard.show();
				onFocus();
			}
		});
		mf.addEventListener('focusout', () => {
			if (editable) {
				mathVirtualKeyboard.hide();
			}
		});

		mf.addEventListener('input', handleKeyDown);

		mf.addEventListener('keydown', (ev) => {
			if (ev.key == 'Backspace') {
				ev.preventDefault();
			}
		});

		mf.addEventListener('move-out', (event) => {
			event.preventDefault();

			document.querySelector('.tiptap').focus({ preventScroll: true });
			if (event.detail.direction === 'forward') {
				$editor.commands.setTextSelection($editor.state.selection.$to.pos + 1);
			}
			if (event.detail.direction === 'backward') {
				$editor.commands.setTextSelection($editor.state.selection.$from.pos);
			}
		});
	});

	export let latexResult = null;
	export let numResult = null;

	let editable = true;
	$: if (
		($currentFile instanceof AssignmentAnswer &&
			$currentFile.status === AssignmentStatus.SUBMITTED) ||
		($currentFile instanceof AssignmentAnswer && $currentFile.status === AssignmentStatus.GRADED) ||
		($currentFile instanceof Assignment && $currentFile.isPublic)
	)
		editable = false;

	let oldRes;

	let cont;
</script>

<!-- AssignmentStatusAssignmentStatuse="text" class="m-20 bg-background p-3 text-3xl" bind:value
on:keydown={handleKeyDown} /> -->

<button
	class={'box-border cursor-auto overflow-hidden border border-transparent pr-2 ' +
		(editable ? ' hover:border-foreground/10' : '')}
	bind:this={cont}
>
	<math-field
		class="rounded-none bg-background p-1 px-2 text-foreground outline-none"
		readonly={!editable}
		bind:this={mf}
	>
		<slot />
	</math-field>
	<span class="mx-auto h-full text-foreground" class:text-muted-foreground={oldRes}>
		{#if !isEq}
			{#if latexResult && latexResult.replaceAll('\\,', '') != value}
				<span class="ML__cmr mr-2">=</span>

				{#if latexResult != null}
					{@html convertLatexToMarkup(latexResult)}
				{/if}
			{/if}
			{#if numResult != undefined && numResult.toString() != latexResult
						.toString()
						.replaceAll('\\,', '')}
				<span class="ML__cmr mx-2">≈</span>
				<div class="ML__latex mr-auto">{numResult}</div>
			{/if}
		{:else}
			<span class="ML__cmr mr-2">|</span>
			<div class="ML__latex mr-auto">{numResult}</div>
		{/if}
	</span>
</button>

<style>
	button:has(math-field:focus) {
		border: 1px solid hsl(var(--foreground) / 0.2);
	}
</style>
