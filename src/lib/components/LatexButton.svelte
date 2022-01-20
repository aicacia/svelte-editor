<script lang="ts">
	import { getEditorContext } from 'svelte-slate';
	import MdFunctions from 'svelte-icons/md/MdFunctions.svelte';
	import Button from './Button.svelte';
	import { insertLatex } from './LatexElement.svelte';
	import { isBlockActive } from '$lib/utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isBlockActive(editor, 'code');

	$: onClick = () => insertLatex(editor);
</script>

<Button {active} {onClick}>
	<MdFunctions />
</Button>
