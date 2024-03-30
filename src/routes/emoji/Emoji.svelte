<script>
	import { toUni } from '@/utils/stringUtils';

	export let emoji;

	console.log(emoji);

	let emo = toUni(emoji);

	$: emo = toUni(emoji);
</script>

<svg class="h-full">
	<use href={`/sprite.svg/#${emo}`}>
		<title>{emoji}</title>
	</use>
</svg>
