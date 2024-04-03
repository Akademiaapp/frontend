<script>
	export let senderName;
	export let message;
	export let tags = [];
</script>

<div>
	<div class="flex flex-col">
		<div class="flex items-center gap-3">
			<span class="font-bold">{senderName}</span>
			{#each tags as tag}
				<span class="tag rounded-full bg-primary px-3 py-0.5 text-sm text-primary-foreground"
					>{tag}</span
				>
			{/each}
		</div>
		<span>{message}</span>
	</div>
</div>
