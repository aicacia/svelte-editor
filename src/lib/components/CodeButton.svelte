<script lang="ts">
	import { getEditorContext } from 'svelte-slate';
	import MdCode from 'svelte-icons/md/MdCode.svelte';
	import Button from './Button.svelte';
	import { insertCode } from './CodeElement.svelte';
	import { isBlockActive } from '$lib/utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isBlockActive(editor, 'code');

	$: onClick = () => insertCode(editor);
</script>

<Button {active} {onClick}>
	<MdCode />
</Button>
