<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import QuickAction from './QuickAction.svelte';
	import fadeScale from '$lib/transitions/fade-scale';
	import { tick } from 'svelte';
	import { expoOut, quadIn, quadInOut, quadOut, sineInOut, sineOut } from 'svelte/easing';
	import * as Command from '$lib/components/ui/command';
	import { fileStore } from '@/api/fileHandler';

	let isSeaching = false;

	window.addEventListener('keydown', (ev) => {
		if (ev.key == 'p' && ev.ctrlKey) {
			isSeaching = true;
			ev.preventDefault();
		}
		if (ev.key == ' ' && ev.ctrlKey) {
			isSeaching = true;
		}

		if (ev.key == 'Enter') {
			isSeaching = false;
		}
	});

	let files = $fileStore;

	$: files = $fileStore;

	console.log(files);
</script>

<QuickAction icon="search" action={() => (isSeaching = true)}></QuickAction>

<Command.Dialog bind:open={isSeaching}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Files">
			{#each files as file}
				<Command.Item>{file.name}</Command.Item>
				<!-- content here -->
			{/each}
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Commands">
			<Command.Item>Profile</Command.Item>
			<Command.Item>Billing</Command.Item>
			<Command.Item>Settings</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>

<style lang="scss">
	.background {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.4);
		// backdrop-filter: blur(100px);
		z-index: 100;
		display: flex;
		/* align-items: center; */
		align-items: self-start;
		justify-content: center;
	}

	.search {
		margin: 5rem;
		margin-top: 20vh;
		background-color: var(--color-bg-1);
		box-shadow: 0.1 0.1rem 1rem rgba(0, 0, 0, 0.1);
		max-width: 35rem;
		width: 100%;
	}

	.search-bar {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 1.2rem;

		img {
			height: 2rem;
			filter: invert(var(--invert-0));
		}
	}

	input {
		padding: 0;
		font-size: 1.5rem;
		background-color: transparent;
		border: none;
		width: 100%;

		&:focus {
			outline: none;
		}

		&::placeholder {
			color: var(--color-text-2);
		}
	}
</style>
