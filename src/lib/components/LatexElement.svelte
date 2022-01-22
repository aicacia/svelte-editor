<script lang="ts" context="module">
	import 'katex/dist/katex.min.css';
	import type { IBaseElement } from './Element.svelte';

	export interface ILatexElement extends IBaseElement {
		type: 'latex';
	}

	export function isLatexElement(element: IBaseElement): element is ILatexElement {
		return element.type === 'latex';
	}

	export function withLatex<T extends SvelteEditor = SvelteEditor>(editor: T): T {
		const { isVoid } = editor;

		editor.isVoid = (element) => {
			return isLatexElement(element as IBaseElement) ? true : isVoid(element);
		};

		return editor;
	}

	export function nodeToString(element: SlateElement | Text): string {
		return SlateElement.isElement(element)
			? element.children.map(nodeToString).join(' ')
			: element.text;
	}

	export function insertLatex(editor: Editor) {
		const isActive = isBlockActive(editor, 'latex');

		if (isActive) {
			Transforms.unwrapNodes(editor, {
				match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === 'latex',
				split: true
			});
		} else {
			const block = { type: 'latex', children: [] };
			Transforms.wrapNodes(editor, block);
		}
	}
</script>

<script lang="ts">
	import Slate, {
		DECORATE_CONTEXT_KEY,
		defaultDecorate
	} from 'svelte-slate/components/Slate.svelte';
	import { findPath, SvelteEditor } from 'svelte-slate';
	import { getEditor } from 'svelte-slate';
	import { Editor, Transforms, Element as SlateElement, Text } from 'slate';
	import { isBlockActive } from '../utils';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import MdCheck from 'svelte-icons/md/MdCheck.svelte';
	import Button from './Button.svelte';
	import katex from 'katex';
	import Modal from './Modal.svelte';

	export let element: ILatexElement;
	export let ref: HTMLElement = undefined;
	export let dir: 'rtl' | 'ltr';

	const editor = getEditor();

	const decorateContext = writable(defaultDecorate);
	setContext(DECORATE_CONTEXT_KEY, decorateContext);

	$: path = findPath(element);
	$: latex = nodeToString(element);

	let latexElement: HTMLElement;
	$: if (latexElement) {
		katex.render(latex, latexElement, {
			displayMode: true,
			output: 'html',
			throwOnError: false
		});
	}

	let editing = false;
	function onEdit() {
		editing = true;
	}
	function onChange() {
		Transforms.setNodes(editor, { latex } as any, { at: path });
		editing = false;
	}
</script>

<div
	class="container"
	bind:this={ref}
	data-slate-node="element"
	data-slate-inline={$$props['data-slate-inline']}
	{dir}
>
	<slot />
	<div contenteditable={false}>
		<span bind:this={latexElement} on:mousedown={onEdit} />
	</div>
</div>

<Modal bind:open={editing}>
	<div class="body">
		<div class="latex">
			<textarea bind:value={latex} />
			<div class="button">
				<Button active={!latex} onClick={onChange}><MdCheck /></Button>
			</div>
		</div>
	</div>
</Modal>

<style>
	.container {
		position: relative;
		margin: 0;
	}
	.body {
		min-width: 256px;
	}
	.latex {
		display: flex;
		background-color: white;
	}
	.button {
		flex-grow: 0;
	}
	textarea {
		flex-grow: 1;
		border: 1px solid #888;
		border-right: none;
		padding: 0.25rem 0.5rem;
		width: 100%;
		outline: none;
	}
</style>
