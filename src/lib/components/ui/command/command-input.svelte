<script lang="ts">
	import { Command as CommandPrimitive } from 'cmdk-sv';
	import { Search } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	type $$Props = CommandPrimitive.InputProps & { wrapperClass?: any };

	let className: string | undefined | null = undefined;
	export { className as class };
	export let value: string = '';
	export let wrapperClass = '';
</script>

<div class={`flex items-center border-b px-2 ${wrapperClass}`} data-cmdk-input-wrapper="">
	<slot>
		<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
	</slot>
	<CommandPrimitive.Input
		class={cn(
			'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		{...$$restProps}
		on:blur
		on:change
		on:focus
		on:input
		bind:value
	/>
</div>
