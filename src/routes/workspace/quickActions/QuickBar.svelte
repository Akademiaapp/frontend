<script>
	import { goto } from '$app/navigation';
	import SearchQ from './SearchQ.svelte';
	import QuickAction from './QuickAction.svelte';
</script>

<div class="container">
	<QuickAction icon="home" action={() => goto("home")} />
	<SearchQ></SearchQ>
	<QuickAction icon="alarm" />
</div>

<style lang="scss">
	.container {
		display: flex;
		gap: 0.5rem;
	}

	span {
		font-size: 2rem;

		color: #7f7f7f;
		transition: color 1s;
		position: absolute;
		&:hover {
			color: black;
			// font-variation-settings: 'FILL' 1;
		}
	}
</style>
