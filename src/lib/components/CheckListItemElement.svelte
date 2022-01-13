<script lang="ts" context="module">
	import type { IBaseElement, IElement } from './Element.svelte';

	export interface ICheckListItemElement extends IBaseElement {
		type: 'check-list-item';
		checked: boolean;
	}

	export function isCheckListItemElement(element: IBaseElement): element is ICheckListItemElement {
		return element.type === 'check-list-item';
	}

	export function withCheckListItems<T extends SvelteEditor = SvelteEditor>(editor: T): T {
		const { deleteBackward } = editor;

		editor.deleteBackward = (...args) => {
			const { selection } = editor;

			if (selection && Range.isCollapsed(selection)) {
				const [match] = Editor.nodes(editor, {
					match: (n) =>
						!Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === 'check-list-item'
				});

				if (match) {
					const [, path] = match;
					const start = Editor.start(editor, path);

					if (Point.equals(selection.anchor, start)) {
						const newProperties: Partial<IElement> = {
							type: 'paragraph'
						};
						Transforms.setNodes(editor, newProperties, {
							match: (n) =>
								!Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === 'check-list-item'
						});
						return;
					}
				}
			}

			deleteBackward(...args);
		};

		return editor;
	}

	export function insertCheckListItem(editor: Editor) {
		const isActive = isBlockActive(editor, 'check-list-item');

		if (isActive) {
			Transforms.unwrapNodes(editor, {
				match: (n) =>
					!Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === 'check-list-item',
				split: true
			});
		} else {
			const block = { type: 'check-list-item', checked: false, children: [] };
			Transforms.wrapNodes(editor, block);
		}
	}
</script>

<script lang="ts">
	import { findPath, getReadOnlyContext, getEditor } from 'svelte-slate';
	import type { SvelteEditor } from 'svelte-slate';
	import { Editor, Transforms, Range, Element as SlateElement, Point } from 'slate';
	import { isBlockActive } from '$lib/utils';

	export let element: ICheckListItemElement;
	export let ref: HTMLElement = undefined;

	const editor = getEditor();
	const readOnlyContext = getReadOnlyContext();

	$: readOnly = $readOnlyContext;
	$: onChange = (event: Event) =>
		Transforms.setNodes(
			editor,
			{
				checked: (event.target as HTMLInputElement).checked
			} as any,
			{ at: findPath(element) }
		);
</script>

<div {...$$restProps} class="check-list-item" bind:this={ref}>
	<span class="checkbox" contenteditable={false}>
		<input type="checkbox" checked={element.checked} on:change={onChange} />
	</span>
	<span class="content" class:checked={element.checked} contenteditable={!readOnly}>
		<slot />
	</span>
</div>

<style>
	.check-list-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.checkbox {
		margin-right: 0.75em;
	}
	.content {
		flex: 1;
		opacity: 1;
	}
	.content.checked {
		opacity: 0.666;
		text-decoration: line-through;
	}
	.content:focus {
		outline: none;
	}
</style>
