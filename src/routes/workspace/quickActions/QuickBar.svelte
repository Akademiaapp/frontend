<script>
	import SearchQ from './SearchQ.svelte';
	import QuickAction from './QuickAction.svelte';
</script>

<div class="container">
	<QuickAction icon="home.svg" />
	<SearchQ></SearchQ>
	<QuickAction icon="alarm.svg" />
</div>

<style>
	.container {
		display: flex;
		gap: 0.5rem;
	}
</style>
