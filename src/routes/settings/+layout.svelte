<script>
	import { buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils';

	settingPages = [
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

<div class="p-6">
	<h1>Settings</h1>

	<p>Settings page</p>

	<div class="flex">
		<div class="flex flex-col gap-4">
			{#each settingPages as page}
				<a class={cn(buttonVariants({ variant: 'ghost' }))} href={page.path}>{page.name}</a>
			{/each}
		</div>
	</div>
</div>
