<script lang="ts">
	import { goto } from '$app/navigation';
	import SearchQ from './SearchQ.svelte';
	import QuickAction from './QuickAction.svelte';
	import { page } from '$app/stores';

	export let isTimerVisible: boolean;
</script>

<QuickAction
	icon="home"
	action={() => goto('/workspace/home')}
	active={$page.route.id?.includes('workspace/home')}
/>
<SearchQ></SearchQ>

<QuickAction
	icon="alarm"
	action={() => isTimerVisible = !isTimerVisible}
	active={isTimerVisible}
/>

<style lang="scss">
</style>
