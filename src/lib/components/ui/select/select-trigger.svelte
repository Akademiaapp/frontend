<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { ChevronDown } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	type $$Props = SelectPrimitive.TriggerProps & { noArrow?: boolean };
	type $$Events = SelectPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;
	export { className as class };

	export let noArrow = false;
</script>

<SelectPrimitive.Trigger
	class={cn(
		'relative flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...$$restProps}
	let:builder
	on:click
	on:keydown
>
	<slot {builder} />
	{#if !noArrow}
		<div class="absolute right-0 grid h-full place-items-center bg-white px-0.5 dark:bg-secondary">
			<ChevronDown class="h-4 w-4 opacity-50" />
		</div>
	{/if}
</SelectPrimitive.Trigger>
