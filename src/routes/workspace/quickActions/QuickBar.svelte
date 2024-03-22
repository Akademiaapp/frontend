<script lang="ts">
	import { goto } from '$app/navigation';
	import SearchQ from './SearchQ.svelte';
	import QuickAction from './QuickAction.svelte';
	import { page } from '$app/stores';
</script>

<QuickAction
	icon="home"
	action={() => goto('/workspace/home')}
	active={$page.route.id?.includes('workspace/home')}
/>
<SearchQ></SearchQ>

<QuickAction
	icon="alarm"
	action={() => goto('/workspace/time')}
	active={$page.route.id?.includes('workspace/time')}
/>

<style lang="scss">
</style>
