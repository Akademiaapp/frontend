<script lang="ts">
	import { Document } from '@tiptap/extension-document';
	import File from './File.svelte';
	import ApiHandler from '$lib/api';

	import { getContext, onMount } from 'svelte';
	import type { AuthorizerState } from 'akademia-authorizer-svelte/types';
	import type { Readable } from 'svelte/store';
	import SideBarElem from './SideBarElem.svelte';
	import randomName from '$lib/randomName';

	const api = new ApiHandler(<Readable<AuthorizerState>>getContext('authorizerContext'));

	interface File {
		name: string;
		id: string;
	}

	export let files: File[] = [];
	export let activeFile = '';
	export let activeFilename = '';
	let userDocuments;

	onMount(async () => {
		userDocuments = await api.getUserDocuments();

		files = await userDocuments.json();
		console.log(files);
	});
</script>

<div class="container br-2">
	{#each files as file}
		<div>
			<File
				name={file?.name}
				onClick={() => {
					activeFile = file?.id;
					activeFilename = file?.name;
				}}
				active={file?.id == activeFile}
			></File>
		</div>
		<!-- content here -->
	{/each}
	<div class="splitter"></div>
	<SideBarElem active={false}>
		<button
			on:click={() => {
				api.createDocument(randomName());
				api.getUserDocuments().then((res) => {
					res.json().then((data) => {
						files = data;
					});
				});
			}}
			class="reset f-full"
		>
			<span class="material-symbols-rounded icon-w-2">add</span>
			<span>New file</span>
		</button>
	</SideBarElem>
</div>

<style>
	.splitter {
		flex: 1;
	}
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 1.05rem;
		color: var(--color-text-2);
		background-color: var(--color-bg-1);
		padding: 0.2rem;
		flex-grow: 1;
	}

	button {
		display: flex;
		gap: 0.25rem;
		justify-self: end;
	}
</style>
