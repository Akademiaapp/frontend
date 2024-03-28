<script>
	export let emoji;

	console.log(emoji);

	const toUni = function (str) {
		if (str.length < 4) return str.codePointAt(0).toString(16);
		return str.codePointAt(0).toString(16) + '-' + str.codePointAt(2).toString(16);
	};

	let emo = toUni(emoji);

	$: emo = toUni(emoji);
</script>

<svg width="25" height="25">
	<use href={`/sprite.svg/#${emo}`}>
		<title>{emoji}</title>
	</use>
</svg>
