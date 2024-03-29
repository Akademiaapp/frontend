<script lang="ts">
	import { FileInfo } from '@/api/apiStore';
	import { capLength } from '$lib/utils/stringUtils';
	import SideBarElem from './SideBarElem.svelte';
	import { File } from 'lucide-svelte';
	export let file: FileInfo;
	export let onClick = () => {};
	export let active = false;
</script>

<SideBarElem {active}>
	<a on:click={onClick} href="editor?id={file.id}&type={file.fileType}" class="reset" class:active>
		<div>
			<File size={20}></File>
		</div>
		<span class="name">{capLength(file.name, 20)}</span>
	</a>
</SideBarElem>

<style lang="scss">
	.name {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.active .name {
		color: var(--color-text-0);
	}

	a {
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;

		div {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
