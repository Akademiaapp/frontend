<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from 'svelte-tiptap';

	import StarterKit from '@tiptap/starter-kit';
	let element;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit],

			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});
</script>

<h1>hi</h1>
<!-- <EditorContent editor={$editor} /> -->
<div bind:this={element} />
