<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { Editor, EditorContent, createEditor } from 'svelte-tiptap';
	import Document from '@tiptap/extension-document';
	import { EditorExtensions } from '@/editor/extensions';
	import { MetaSettingsExtension } from '../editor/tiptap/extensions/MetaSettingsExtension';
	import { MathExtension } from '../editor/tiptap/extensions/MathExtension';

	import { editor } from '../editor/editorStore';

	onMount(() => {
		editor.set(
			new Editor({
				extensions: [...EditorExtensions, Document, MathExtension],
				content: `
        <p>This is still the text editor you’re used to, but enriched with node views.</p>
        <p>Did you see that? That’s a Svelte component. We are really living in the future.</p>
		<p>Here is a math component: <math-component>1+1</math-component></p>
		
      `
			})
		);
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/mathlive/dist/mathlive-static.css" />
</svelte:head>
<div class="m-5 bg-background p-5">
	<EditorContent editor={$editor} />
</div>

<style>
	:global(.tiptap) {
		padding: 2rem;
	}
</style>
