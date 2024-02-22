<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { Editor, EditorContent, createEditor } from 'svelte-tiptap';
	import Document from '@tiptap/extension-document';
	import { EditorExtensions } from '@/editor/extensions';
	import { MetaSettingsExtension } from '../editor/tiptap/extensions/MetaSettings';

	let editor: Readable<Editor>;

	onMount(() => {
		editor = createEditor({
			extensions: [
				...EditorExtensions,
				Document.extend({
					content: 'metaSettings block+'
				}),
				,
				MetaSettingsExtension
			],
			content: `
        <p>This is still the text editor you’re used to, but enriched with node views.</p>
        <meta-settings-component></meta-settings-component>
        <p>Did you see that? That’s a Svelte component. We are really living in the future.</p>
      `
		});
	});
</script>

<div class="m-5">
	<EditorContent editor={$editor} />
</div>
