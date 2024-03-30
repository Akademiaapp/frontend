<script>
	import { Separator } from '$lib/components/ui/separator';
	import { page } from '$app/stores';
	import { buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { X } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const settingPages = [
		{
			name: 'Appearance',
			path: 'appearance'
		},
		{
			name: 'Account',
			path: 'account'
		},
		{
			name: 'Aula Integration',
			path: 'aula'
		}
	];
</script>

<div class="m-auto max-w-[80rem] p-6">
	<div class="p-2">
		<div class="flex justify-between">
			<h1 class="mb-1">Settings</h1>

			<button on:click={() => goto('/workspace/home')}>
				<X class="cursor-pointer" size={32} />
			</button>
		</div>

		<p class="text-sm text-muted-foreground">Settings page</p>
		<Separator class="mt-4"></Separator>
	</div>

	<div class="flex py-2">
		<div class="flex w-[10rem] flex-col gap-2">
			{#each settingPages as setting}
				<a
					class={cn(
						buttonVariants({ variant: 'ghost' }),
						'h-8 justify-start px-4 text-foreground hover:bg-muted hover:no-underline'
					)}
					class:bg-muted={$page.route.id?.includes(setting.path)}
					href={'/settings/' + setting.path}>{setting.name}</a
				>
			{/each}
		</div>
		<div class="px-6">
			<slot />
		</div>
	</div>
</div>
