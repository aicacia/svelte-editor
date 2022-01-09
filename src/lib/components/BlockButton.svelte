<script lang="ts">
	import { getEditorContext } from 'svelte-slate/src/lib';
	import Button from './Button.svelte';
	import { isBlockActive, toggleBlock } from '../utils';

	export let format: string;

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isBlockActive(editor, format);
	$: onClick = (event: MouseEvent) => {
		event.preventDefault();
		toggleBlock(editor, format);
	};
</script>

<Button {active} {onClick}>
	<slot />
</Button>
