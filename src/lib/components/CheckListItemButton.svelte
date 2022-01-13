<script lang="ts">
	import { getEditorContext } from 'svelte-slate';
	import MdPlaylistAddCheck from 'svelte-icons/md/MdPlaylistAddCheck.svelte';
	import Button from './Button.svelte';
	import { insertCheckListItem } from './CheckListItemElement.svelte';
	import { isBlockActive } from '$lib/utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: active = isBlockActive(editor, 'check-list-item');

	$: onClick = () => insertCheckListItem(editor);
</script>

<Button {active} {onClick}>
	<MdPlaylistAddCheck />
</Button>
