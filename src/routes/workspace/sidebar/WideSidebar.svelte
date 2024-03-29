<script lang="ts">
	import QuickBar from '../quickActions/QuickBar.svelte';
	import FileViewer from './FileViewer.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import Timer from './Timer.svelte';
	export let isExpanded: boolean;

	let isTimerVisible: boolean;
</script>

<div class="cont br-2 float-panel">
	<div class="top">
		<UserAvatar name />
		<button
			class="reset z-10"
			on:click={() => {
				isExpanded = !isExpanded;
			}}
		>
			<span class="material-symbols-rounded icon-w-4">keyboard_double_arrow_left</span>
		</button>
	</div>
	<div class="flex gap-2" id="quick-bar"><QuickBar bind:isTimerVisible /></div>
</div>

<FileViewer></FileViewer>

<Timer bind:visible={isTimerVisible}></Timer>

<style lang="scss">
	.cont {
		min-width: 250px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1rem;
		flex-direction: column;
		background-color: var(--color-bg-1);
	}

	.top {
		display: flex;

		align-items: center;

		justify-content: space-between;

		button {
			span {
				font-size: 2rem;

				transition: rotate 300ms ease;
				vertical-align: middle;
			}

			transition: all 100ms;

			background-color: var(--color-bg-1);

			padding: 0.25rem;

			color: var(--color-text-1);

			border-radius: 8px;

			&:hover {
				color: var(--color-text-0);
			}
		}
	}
</style>
