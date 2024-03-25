<script lang="ts">
	import { userInfo } from '@/api/apiStore';

	export let name = false;
</script>

<div class="cage">
	<img
		class="avatar br-2"
		src="https://gravatar.com/avatar/9d9ca268a5cc1b4399c88aaee589922a"
		alt="User avatar"
		referrerpolicy="no-referrer"
	/>
	{#if name}
		<p>
			{$userInfo.name}
		</p>
	{/if}
</div>

<style lang="scss">
	p {
		margin: 0;
		font-weight: bold;
		color: var(--color-text-1);
	}
	.cage {
		display: flex;
		gap: 0.75rem;
		justify-self: center;
		align-items: center;
	}
	.avatar {
		width: 2rem;
		height: 2rem;
		cursor: pointer;
		overflow: hidden;
	}
</style>
