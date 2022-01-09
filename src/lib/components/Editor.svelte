<script lang="ts" context="module">
	const HOTKEYS = {
		'mod+b': 'bold',
		'mod+i': 'italic',
		'mod+u': 'underline',
		'mod+`': 'code'
	};
</script>

<script lang="ts">
	import { Slate, Editable, withSvelte } from 'svelte-slate/src/lib';
	import type { Selection } from 'slate';
	import { createEditor } from 'slate';
	import { withHistory } from 'slate-history';
	import { toggleMark, withImages } from '../utils';
	import type { IElement } from './Element.svelte';
	import Element from './Element.svelte';
	import type { IText } from './Leaf.svelte';
	import Leaf from './Leaf.svelte';
	import isHotkey from 'is-hotkey';
	import HoveringToolbar from './HoveringToolbar.svelte';
	import { onMount } from 'svelte';
	import { longpress } from '$lib/longpress';

	export let value: Array<IText | IElement> = [
		{
			type: 'paragraph',
			children: [{ text: '' }]
		}
	];
	export let selection: Selection | null = null;

	let state = { open: false };
	let ref: HTMLDivElement;
	const editor = withHistory(withImages(withSvelte(createEditor())));

	function onKeyDown(event: KeyboardEvent) {
		for (const hotkey in HOTKEYS) {
			if (isHotkey(hotkey, event)) {
				event.preventDefault();
				const mark = HOTKEYS[hotkey];
				toggleMark(editor, mark);
			}
		}
	}

	onMount(() => {
		const lp = longpress(ref, 300);

		function onLongPress() {
			state.open = true;
		}

		ref.addEventListener('longpress', onLongPress);

		return () => {
			lp.destroy();
			ref.removeEventListener('longpress', onLongPress);
		};
	});
</script>

<Slate {editor} bind:selection bind:value>
	<HoveringToolbar container={ref} open={state.open} />
	<Editable bind:ref {Element} {Leaf} {onKeyDown} placeholder="Type..." />
</Slate>
