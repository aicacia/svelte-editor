<script lang="ts">
	import { findPath, getFocusedContext, getSelectedContext } from 'svelte-slate/src/lib';
	import type { SvelteEditor } from 'svelte-slate/src/lib';
	import { Transforms } from 'slate';
	import { Button } from '$lib';
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import type { IImageElement } from './Element.svelte';

	export let editor: SvelteEditor;
	export let element: IImageElement;
	export let ref: HTMLElement = undefined;

	const selectedContext = getSelectedContext();
	const focusedContext = getFocusedContext();

	$: selected = $selectedContext && $focusedContext;
	$: path = findPath(element);
	$: onRemove = () => Transforms.removeNodes(editor, { at: path });
</script>

<div bind:this={ref} {...$$restProps}>
	<slot />
	<div contentEditable={false} class="image">
		<img src={element.url} alt="" class:selected />
		<div class="delete" class:selected>
			<Button onClick={onRemove}>
				<MdDelete />
			</Button>
		</div>
	</div>
</div>

<style>
	.image {
		position: relative;
	}
	.image img {
		display: block;
		max-width: 100%;
	}
	.image img.selected {
		box-shadow: 0 0 0 3px #333;
	}

	.delete {
		position: absolute;
		top: 0.5em;
		left: 0.5em;
		background-color: white;
	}
	.delete.selected {
		display: inline;
	}
</style>
