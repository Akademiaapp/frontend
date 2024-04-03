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
		console.log(textarea);
		console.log('i changed the height of the textarea');
	}
</script>

<Textarea
	style="height: {height}px;"
	on:change={() => console.log('hi')}
	bind:value
	bind:textarea
	{...$$restProps}
/>
