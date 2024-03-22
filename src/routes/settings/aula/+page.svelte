<script>
	import { Input } from '$lib/components/ui/input';

	let username = '';
	let password = '';

	$: console.log(username, password);
</script>

<form>
	<Input type="text" placeholder="Username" bind:value={username} />
	<Input type="password" placeholder="Password" bind:value={password} />
</form>
