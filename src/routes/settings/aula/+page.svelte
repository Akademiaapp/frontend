<script>
	import { Input } from '$lib/components/ui/input';
	import Button from '@/components/ui/button/button.svelte';

	let username = '';
	let password = '';

	$: console.log(username, password);
</script>

<h1 class="mb-0">Aula Integration</h1>
<p class="text-sm text-muted-foreground">
	Gør det muligt at se dine Aula informationer direkte inde i Akademia
</p>

<h2 class="mt-4">Unilogin</h2>
<form class="flex w-[20rem] flex-col gap-4" on:submit={() => console.log('hdhdh')}>
	<Input type="text" placeholder="Username" bind:value={username} />
	<Input type="password" placeholder="Password" bind:value={password} />

	<Button type="submit" variant="outline">Save</Button>
</form>
