<script lang="ts">
	import { fetchAula } from '@/api/AulaApiStore';

	let notfiCount = 0;

	fetchAula('getNotifications', {}).then((res) => {
		res.json().then((json) => {
			notfiCount = json.data.length;
		});
	});
</script>

{#if notfiCount > 0}
	<div class="bg br-2 relative">
		<img
			src="https://aulainfo.dk/wp-content/themes/aula-info/assets/img/logo__aula--white.svg"
			alt="aula logo"
		/>
		<p class="absolute -right-0.5 -top-1 min-w-4 rounded-full bg-red-600 p-0 text-center text-xs">
			{notfiCount}
		</p>
	</div>
{/if}

<style>
	.bg {
		background-color: rgb(24, 99, 143);

		margin: 0 0.5rem;
		aspect-ratio: 1;
		border-radius: 100rem;
		display: grid;
		place-items: center;
	}

	img {
		width: 1.5rem;
	}
</style>
