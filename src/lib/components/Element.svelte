<script lang="ts" context="module">
	import type { IText } from './Leaf.svelte';
	import type { IImageElement } from './ImageElement.svelte';

	export interface IBaseElement {
		type: string;
		children: (IElement | IText)[];
	}

	export type IElement = IBaseElement | IImageElement | ICheckListItemElement | ICodeElement;
</script>

<script lang="ts">
	import { isImageElement } from './ImageElement.svelte';
	import ImageElement from './ImageElement.svelte';
	import type { ICheckListItemElement } from './CheckListItemElement.svelte';
	import CheckListItemElement, { isCheckListItemElement } from './CheckListItemElement.svelte';
	import type { ICodeElement } from './CodeElement.svelte';
	import CodeElement, { isCodeElement } from './CodeElement.svelte';

	export let element: IElement;
	export let ref: HTMLElement = undefined;
</script>

{#if element?.type === 'block-quote'}<blockquote bind:this={ref} {...$$restProps}>
		<slot />
	</blockquote>{:else if element?.type === 'bulleted-list'}<ul bind:this={ref} {...$$restProps}>
		<slot />
	</ul>{:else if element?.type === 'heading-one'}<h1 bind:this={ref} {...$$restProps}>
		<slot />
	</h1>{:else if element?.type === 'heading-two'}<h2 bind:this={ref} {...$$restProps}>
		<slot />
	</h2>{:else if element?.type === 'list-item'}<li bind:this={ref} {...$$restProps}>
		<slot />
	</li>{:else if element?.type === 'numbered-list'}<ol bind:this={ref} {...$$restProps}>
		<slot />
	</ol>{:else if isImageElement(element)}<ImageElement bind:ref {...$$restProps} {element}
		><slot /></ImageElement
	>{:else if isCheckListItemElement(element)}<CheckListItemElement
		bind:ref
		{...$$restProps}
		{element}><slot /></CheckListItemElement
	>{:else if isCodeElement(element)}<CodeElement bind:ref {...$$restProps} {element}
		><slot /></CodeElement
	>{:else}<p bind:this={ref} {...$$restProps}><slot /></p>{/if}

<style>
	blockquote,
	ul,
	h1,
	h2,
	li,
	ol,
	p {
		position: relative;
		margin: 0;
	}

	blockquote {
		border-left: 2px solid #ddd;
		margin-left: 0;
		margin-right: 0;
		padding-left: 10px;
		color: #aaa;
		font-style: italic;
	}
</style>
