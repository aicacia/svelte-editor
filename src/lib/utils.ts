import { Editor, Transforms, Element as SlateElement } from 'slate';
import isUrl from 'is-url';
import imageExtensions from 'image-extensions';
import type { SvelteEditor } from 'svelte-slate/src/lib';

export function isMarkActive(editor: Editor, format: string): boolean {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
}

export function toggleMark(editor: Editor, format: string) {
	const isActive = isMarkActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
}

export function isBlockActive(editor: Editor, format: string): boolean {
	if (!editor.selection) {
		return false;
	}

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, editor.selection),
			match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n['type'] === format
		})
	);

	return !!match;
}

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

export function toggleBlock(editor: Editor, format: string) {
	const isActive = isBlockActive(editor, format);
	const isList = LIST_TYPES.includes(format);

	Transforms.unwrapNodes(editor, {
		match: (n) =>
			!Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n['type']),
		split: true
	});
	const newProperties = {
		type: isActive ? 'paragraph' : isList ? 'list-item' : format
	};
	Transforms.setNodes<SlateElement>(editor, newProperties as any);

	if (!isActive && isList) {
		const block = { type: format, children: [] };
		Transforms.wrapNodes(editor, block);
	}
}

export function withImages<T extends SvelteEditor = SvelteEditor>(editor: T): T {
	const { insertData, isVoid } = editor;

	editor.isVoid = (element) => {
		return element['type'] === 'image' ? true : isVoid(element);
	};

	editor.insertData = (data) => {
		const text = data.getData('text/plain');
		const { files } = data;

		if (files && files.length > 0) {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const reader = new FileReader();
				const [mime] = file.type.split('/');

				if (mime === 'image') {
					reader.addEventListener('load', () => {
						const url = reader.result;
						insertImage(editor, url);
					});

					reader.readAsDataURL(file);
				}
			}
		} else if (isImageUrl(text)) {
			insertImage(editor, text);
		} else {
			insertData(data);
		}
	};

	return editor;
}

export function insertImage(editor: Editor, url: string | ArrayBuffer) {
	const text = { text: '' };
	const image = { type: 'image', url, children: [text] };
	Transforms.insertNodes(editor, image);
}

export function isImageUrl(url: string): boolean {
	if (!url) {
		return false;
	}
	if (!isUrl(url)) {
		return false;
	}
	const ext = new URL(url).pathname.split('.').pop();
	return imageExtensions.includes(ext);
}
