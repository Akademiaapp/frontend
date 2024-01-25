<script lang="ts">
	import { goto } from '$app/navigation';
	import SearchQ from './SearchQ.svelte';
	import QuickAction from './QuickAction.svelte';
	import { page } from '$app/stores';
</script>

<div class="cont">
	<QuickAction
		icon="home"
		action={() => goto('home')}
		active={$page.route.id?.includes('workspace/home')}
	/>
	<SearchQ></SearchQ>
	<QuickAction icon="alarm" />
</div>

<style lang="scss">
	.cont {
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
