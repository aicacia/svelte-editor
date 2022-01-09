export function longpress(node: HTMLElement, threshold = 500) {
	function onStart(event: Event) {
		const timeout = setTimeout(() => {
			node.dispatchEvent(new CustomEvent('longpress', event));
		}, threshold);

		function cancel() {
			clearTimeout(timeout);
			node.removeEventListener('mousemove', cancel);
			node.removeEventListener('mouseup', cancel);
		}

		node.addEventListener('mousemove', cancel);
		node.addEventListener('mouseup', cancel);
	}

	node.addEventListener('mousedown', onStart);

	return {
		destroy() {
			node.removeEventListener('mousedown', onStart);
		}
	};
}
