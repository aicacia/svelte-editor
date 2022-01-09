<script lang="ts" context="module">
	function repositionElement(ref: HTMLElement, container: HTMLElement) {
		const domSelection = window.getSelection();
		if (domSelection.anchorNode && domSelection.focusNode) {
			const domRange = domSelection.getRangeAt(0);
			const rect = domRange.getBoundingClientRect();
			const viewRect = container.getBoundingClientRect();
			ref.style.left = `${rect.left + window.pageXOffset - ref.offsetWidth / 2 + rect.width / 2}px`;
			if (rect.top + window.pageYOffset - ref.offsetHeight < viewRect.top) {
				ref.style.top = `${rect.bottom + window.pageYOffset + 4}px`;
			} else {
				ref.style.top = `${rect.top + window.pageYOffset - ref.offsetHeight - 4}px`;
			}
			ref.style.opacity = '1';
		}
	}
</script>

<script lang="ts">
	import { Editor, Range } from 'slate';
	import Portal from 'svelte-portal/src/Portal.svelte';
	import { getEditorContext, getFocusedContext } from 'svelte-slate/src/lib';
	import Buttons from './Buttons.svelte';

	export let container: HTMLElement = undefined;
	export let open = false;

	$: if (container === undefined && typeof document !== 'undefined') {
		container = document.body;
	}

	const editorContext = getEditorContext();
	const focusContext = getFocusedContext();
	$: editor = $editorContext;
	$: focus = $focusContext;

	let ref: HTMLElement;
	$: if (ref) {
		if (
			!editor.selection ||
			!focus ||
			Range.isCollapsed(editor.selection) ||
			Editor.string(editor, editor.selection) === ''
		) {
			open = false;
		} else {
			open = true;
		}
	}

	$: if (ref) {
		if (open) {
			repositionElement(ref, container);
		} else {
			ref.removeAttribute('style');
		}
	}
</script>

<Portal>
	<div bind:this={ref} class="menu">
		<Buttons />
	</div>
</Portal>

<style>
	.menu {
		background-color: #fff;
		border: 1px solid #888;
		padding: 0.25rem;
		position: absolute;
		z-index: 1;
		top: -10000px;
		left: -10000px;
		opacity: 0;
	}
</style>
