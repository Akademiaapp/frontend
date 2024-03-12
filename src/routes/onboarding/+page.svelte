<script>
	import { goto } from '$app/navigation';
	import Button from '@/components/ui/button/button.svelte';
</script>

<h2>Velkommen til</h2>
<img src="brand/title-logo.svg" alt="" />
<p>
	Fremtidens platform til skolernes digitale behov som opgaver, kalender, notetagnet og meget mere.
	Alt sammen samlet på en platform
</p>

<div class="spacer"></div>

<Button
	class="mt-auto"
	on:click={() => {
		goto('onboarding/1');
	}}>Kom i gang</Button
>
<a rel="stylesheet" href="">Skip</a>

<div></div>

<style>
	.cont {
		/* height: 100%; */
		/* height: 100%; */
		margin: 4rem 1rem;
		max-width: 30rem;
		width: 100%;
		max-height: min(35rem, 100% - 4rem);
		background-color: var(--color-bg-1);

		padding: 3rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;

		overflow: auto;
	}

	h2 {
		font-weight: normal;
		margin: 0;
	}

	img {
		margin-left: -1rem;
	}

	a {
		color: var(--color-text-2);
		font-size: 0.75rem;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
</style>
