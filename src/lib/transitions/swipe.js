export default function swipe(node, { delay = 0, duration = 2000, easing = (x) => x }) {
	return {
		delay,
		duration,
		css: (t) => {
			const eased = easing(t);
			return `transform: translate(${eased * 100}%, 0)`;
		}
	};
}
