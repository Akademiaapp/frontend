<script lang="ts">
	export let name: string;
	export let id: string = '26e29956-af96-4b22-b088-2a0d5d1474ad';
</script>

<a href={'/workspace/editor?id=' + id + '&type=document'} class="reset activeFile frontground">
	<div class="text">
		<p class="name">{name}</p>
	</div>
</a>

<style lang="scss">
	:global(.activeFile) {
		display: flex;
		min-height: 2rem;

		justify-content: space-between;
		align-items: center;

		border-radius: 0.7rem;

		border: solid rgba(var(--rga), 0.1) 0.1rem;
		box-shadow: 0.05rem 0.05rem 0.7rem rgba(0, 0, 0, 0.06);

		padding: 0.4rem 1rem;

		gap: 0.5rem;

		transition:
			transform 300ms ease,
			border 200ms ease;

		&:hover {
			transform: translateY(-0.15rem);
			transition:
				transform 200ms ease,
				border 150ms ease;
			border: solid rgba(var(--rga), 0.2) 0.1rem;
		}
	}

	.text {
		max-width: 100%;
		p {
			margin: 0;
			text-wrap: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
</style>
