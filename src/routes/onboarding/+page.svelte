<script>
	import { goto } from '$app/navigation';
	import Button from '@/components/ui/button/button.svelte';
</script>

<h2>Velkommen til</h2>
<img src="brand/title-logo.svg" alt="" />
<p>
	Fremtidens platform til skolernes digitale behov som opgaver, kalender, notetagnet og meget mere.
	Alt sammen samlet på én platform.
</p>

<div class="spacer"></div>

<Button
	class="mt-auto"
	on:click={() => {
		goto('onboarding/1');
	}}>Kom i gang</Button
>
<a href="/workspace/home">Skip</a>

<div></div>

<style lang="scss">
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
