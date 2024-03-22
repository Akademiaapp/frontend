<script>
	import { Input } from '@/components/ui/input';

	let email = '';
</script>

<div class="flex w-full flex-col items-stretch">
	<h1 class="mb-8 text-center text-5xl">Login</h1>

	<p class="my-1 text-sm text-muted-foreground">Forsæt ved brug af email</p>
	<Input type="email" placeholder="Enter your email" bind:value={email} />
</div>
