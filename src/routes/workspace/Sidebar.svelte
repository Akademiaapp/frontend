<script lang="ts">
	import QuickBar from './quickActions/QuickBar.svelte';
	import FileViewer from './FileViewer.svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	export let activeFile: string;
	export let activeFilename: string;
	export let sidebarVisible: boolean;
</script>

<nav class="sideBar" class:hidden={!sidebarVisible}>
	<div class="settings br-2 float-panel">
		<div class="top">
			<UserAvatar name />
			<button
				class="reset"
				on:click={() => {
					sidebarVisible = !sidebarVisible;
				}}
			>
				<span class="material-symbols-rounded icon-w-4">keyboard_double_arrow_left</span>
			</button>
		</div>
		<QuickBar bind:activeFile />
	</div>

	<FileViewer bind:activeFile bind:activeFilename></FileViewer>
</nav>

<style lang="scss">
	.settings {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 1rem;
		flex-direction: column;
		background-color: var(--color-bg-1);
	}

	.sideBar {
		pointer-events: auto;
		resize: horizontal;
		width: 18rem;
		min-width: 10rem;
		max-width: 16rem;
		display: flex;
		gap: 0.75rem;
		flex-direction: column;

		&.hidden {
			button {
				span {
					rotate: 180deg;
				}

				position: sticky;
				left: 10px;

				transform: translate(4.5rem, -1rem);
			}
		}
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
