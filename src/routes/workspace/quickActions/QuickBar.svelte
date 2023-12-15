<script>
	import QuickAction from './QuickAction.svelte';
</script>

<div class="container">
	<QuickAction icon="home.svg" />
	<QuickAction icon="search.svg" />
	<QuickAction icon="alarm.svg" />
</div>

<style>
	.container {
		display: flex;
		gap: 0.5rem;
	}
</style>
