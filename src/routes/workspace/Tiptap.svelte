<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { Editor } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import Collaboration from '@tiptap/extension-collaboration'
    import * as Y from 'yjs'
    import { HocuspocusProvider } from '@hocuspocus/provider'
  
    let element: Element;

    export const resize = () => console.log("resize child");

    let editor: Editor;
    export let activeFile: string;
    $: activeFile && initializeTiptap(activeFile);

    function initializeTiptap(activeFile: string) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      if (editor) {
        editor.destroy();
      }
      const ydoc = new Y.Doc();
      const provider = new HocuspocusProvider({
        url: "wss://vps.arctix.dev:8091",
        name: activeFile,
        document: ydoc,
        onConnect: () => {
          editor = new Editor({
            element: element,
            extensions: [
              StarterKit.configure({
                history: false,
              }),
              Collaboration.configure({
                document: ydoc,
              })
            ],
            content: '<p>Hello World! 🌍️ </p>',
            onTransaction: () => {
              editor = editor
            }
          })
        },
      });
    }

    onMount(() => {
      initializeTiptap(activeFile);
    })
  
    onDestroy(() => {
      if (editor) {
        editor.destroy()
      }
    })
  </script>

  <h1>this is tiptap:</h1>
  
  {#if editor}
    <button
      on:click={() => editor.chain().focus().toggleHeading({ level: 1}).run()}
      class:active={editor.isActive('heading', { level: 1 })}
    >
      H1
    </button>
    <button
      on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      class:active={editor.isActive('heading', { level: 2 })}
    >
      H2
    </button>
    <button on:click={() => editor.chain().focus().setParagraph().run()} class:active={editor.isActive('paragraph')}>
      P
    </button>
  {/if}
  
  <div id="editor" bind:this={element} />
  
  <style>
    button.active {
      background: rgb(0, 0, 0);
      color: white;
    }

    :global(.ProseMirror:focus) {
        outline: none;
    }
  </style>