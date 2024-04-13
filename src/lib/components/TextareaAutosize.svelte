<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Textarea from './ui/textarea/textarea.svelte';
	type $$Props = ComponentProps<Textarea>;

	let textarea;
	export let value: string | number | string[] = '';

	$: changeHeight(value);

	let height = 10;

	function changeHeight(value) {
		if (!textarea) return;

		height = textarea.scrollHeight;
	}
</script>

<Textarea
	style="height: {height}px;"
	bind:value
	bind:textarea
	{...$$restProps}
/>
