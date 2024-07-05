# SupaStore Library

SupaStore is a state management library designed for Svelte applications, offering seamless integration with Supabase for real-time data synchronization and IndexedDB for offline data storage capabilities.

## Features

✅ **Easy Integration:** Designed to work effortlessly with Svelte and Supabase, making setup quick and straightforward.
✅ **Real-time Data Sync:** Utilizes Supabase's real-time capabilities to keep your application data synchronized.
✅ **Offline Support:** Leverages IndexedDB for storing data locally, enabling offline usage of your application.

<!-- ✅ **Flexible Data Stores:** Supports various types of stores including SupaStore, KeyedSupaStore, and ViewStore for different use cases. -->

## Installation

Ehm, it's allready in the project

<!-- ```bash
npm install @your-org/supastore
```

Or if you prefer using yarn:

```bash
yarn add @your-org/supastore
``` -->

## Getting Started

### **Initializing SupaStore with Supabase**

First, ensure you have [initialized Supabase](https://supabase.com/docs/reference/javascript/typescript-support) as you normally would in your project, but switch out `createClient` with `new svelteSupabase`. It should now look something like this:

```ts
export const supabase = new svelteSupabase<Database>(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY
);
```

### **Quick start**

You can create a new store using `supabase.store`

```ts
const todos = supaStoreClient.store('todo');

createIndexedDB([todos]);

supabase.realtimeChannel.subscribe();
```

### **Multiple stores**

```ts
const todos = supaStoreClient.store('todo');
const files = supaStoreClient.store('file');
const chats = supaStoreClient.store('chat');

createIndexedDB([todos, files, chats]);

supabase.realtimeChannel.subscribe();
```

### **Different types of stores**

You can create different types of stores based on your needs: `SupaStore`, `KeyedSupaStore`, or `ViewStore`

**Store**
This is the base store wich has all the basic features such as realtime and indexedDB. All the other store types are based on this one.

```ts
const myTableStore = supaStoreClient.store('my_table');
```

**Keyed store**
The keyed store is for when you want to categorize/group some information. The grouping only happens client side

```ts
const todos = supaStoreClient.keyedStore('todo').setKey('progress');
```

This can then be later used by doing the following

```svelte
<script>
	import { todos } from './stores';

	let _todos = [];
	todos.keyedStore.subscribe((todos) => {
		_todos = todos;
	});
</script>

{#each _todos as [progress, ts]}
	<h1>{progress}</h1>
	{#each ts as t}
		<div>{t}</div>
	{/each}
{/each}
```

**View store**

Notice: View stores are NOT at a usable state yet.

Used when wanting to use a View as a store. Needs a additional base table, that the view is based on for realtime and modifing to work.

```ts
const myViewStore = supaStoreClient.viewStore('my_view', 'base_table');
```

3. **Using Stores in Components**

Utilize the created stores in your Svelte components for real-time data binding.

```svelte
<script>
	import { myTableStore } from './stores';

	let items = [];
	myTableStore.subscribe(($items) => {
		items = $items;
	});
</script>

{#each items as item}
	<div>{item.name}</div>
{/each}
```

## Documentation

Well, feel free to write one. If you are lucky I maybe put some comments in the code.

For detailed documentation and API references, please visit [SupaStore Documentation](#).

<!-- ## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to submit pull requests. -->

<!--
## License

SupaStore is [MIT licensed](LICENSE).. -->
