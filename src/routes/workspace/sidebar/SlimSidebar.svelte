<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Notebook, PanelLeft, Settings, File } from 'lucide-svelte';
	import QuickAction from '../quickActions/QuickAction.svelte';
	import SearchQ from '../quickActions/SearchQ.svelte';

	export let isExpanded;
</script>

<div class="flex h-full flex-col justify-between">
	<div class="frontground br-2">
		<QuickAction
			action={() => {
				isExpanded = !isExpanded;
			}}
		>
			<PanelLeft size="29"></PanelLeft>
		</QuickAction>
		<QuickAction
			icon="home"
			action={() => goto('home')}
			active={$page.route.id?.includes('workspace/home')}
		/>
		<SearchQ></SearchQ>
		<QuickAction icon="alarm" />
	</div>
	<div class="flex flex-col gap-2">
		<div class="frontground br-2">
			<QuickAction>
				<File size="29"></File>
			</QuickAction>
			<QuickAction>
				<Notebook size="29"></Notebook>
			</QuickAction>
		</div>
		<div class="frontground br-2">
			<QuickAction>
				<Settings size="29"></Settings>
			</QuickAction>
		</div>
	</div>
</div>

<style>
	.frontground {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		padding: 0.7rem;
	}
</style>
