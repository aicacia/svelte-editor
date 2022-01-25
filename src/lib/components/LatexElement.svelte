<script lang="ts" context="module">
	import 'katex/dist/katex.min.css';
	import type { IBaseElement } from './Element.svelte';

	export interface ILatexElement extends IBaseElement {
		type: 'latex';
		latex: string;
		inline: boolean;
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

	export function insertLatex(editor: Editor) {
		const image = { type: 'latex', latex: '', inline: true, children: [{ text: '' }] };
		Transforms.insertNodes(editor, image);
	}
</script>

<script lang="ts">
	import { DECORATE_CONTEXT_KEY, defaultDecorate } from 'svelte-slate/components/Slate.svelte';
	import { findPath, SvelteEditor } from 'svelte-slate';
	import { getEditor } from 'svelte-slate';
	import { Editor, Transforms } from 'slate';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import MdCheck from 'svelte-icons/md/MdCheck.svelte';
	import MdFormatIndentIncrease from 'svelte-icons/md/MdFormatIndentIncrease.svelte';
	import Button from './Button.svelte';
	import katex from 'katex';
	import Modal from './Modal.svelte';

	export let element: ILatexElement;
	export let ref: HTMLElement;
	export let isInline: boolean;
	export let isVoid: boolean;
	export let contenteditable: boolean;
	export let dir: 'rtl' | 'ltr' = undefined;

	const editor = getEditor();

	const decorateContext = writable(defaultDecorate);
	setContext(DECORATE_CONTEXT_KEY, decorateContext);

	$: path = findPath(element);
	let currentLatex = element.latex;
	$: if (currentLatex !== element.latex) {
		currentLatex = element.latex;
	}
	let currentInline = element.inline;
	$: if (currentInline !== element.inline) {
		currentInline = element.inline;
	}

	let latexElement: HTMLElement;
	$: if (latexElement) {
		katex.render(currentLatex, latexElement, {
			displayMode: !currentInline,
			output: 'html',
			throwOnError: false
		});
	}

	let editing = false;
	let latex: string;
	let inline: boolean;
	function onEdit() {
		latex = currentLatex;
		inline = currentInline;
		editing = true;
	}
	function onLatexChange() {
		Transforms.setNodes(editor, { latex, inline } as any, { at: path });
		editing = false;
	}
	function onInlineChange() {
		inline = !inline;
	}

	let latexDisplayElement: HTMLElement;
	$: if (editing && latexDisplayElement) {
		katex.render(latex, latexDisplayElement, {
			displayMode: !inline,
			output: 'html',
			throwOnError: false
		});
	}
</script>

<div
	class="container"
	class:inline={currentInline}
	bind:this={ref}
	data-slate-node="element"
	data-slate-inline={isInline}
	data-slate-void={isVoid}
	{dir}
>
	<div contenteditable={false}>
		<span bind:this={latexElement} on:mousedown={onEdit} />
	</div>
</div>

<Modal bind:open={editing}>
	<div class="body">
		<div class="editor">
			<div class="latex">
				<div>
					<textarea bind:value={latex} />
				</div>
				<div>
					<span bind:this={latexDisplayElement} />
				</div>
			</div>
			<div class="button">
				<Button active={!latex} onClick={onLatexChange}><MdCheck /></Button>
				<Button active={!inline} onClick={onInlineChange}><MdFormatIndentIncrease /></Button>
			</div>
		</div>
	</div>
</Modal>

<style>
	.container {
		position: relative;
		margin: 0;
	}
	.inline {
		display: inline-block;
	}
	.body {
		min-width: 300px;
		background-color: white;
	}
	.editor {
		display: flex;
	}
	.latex {
		flex-direction: column;
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
