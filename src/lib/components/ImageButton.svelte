<script lang="ts">
	import { getEditorContext } from 'svelte-slate/src/lib';
	import MdImage from 'svelte-icons/md/MdImage.svelte';
	import Button from './Button.svelte';
	import { insertImage, isImageUrl } from '../utils';

	const editorContext = getEditorContext();
	$: editor = $editorContext;
	$: onClick = (event: MouseEvent) => {
		event.preventDefault();
		const url = window.prompt('Enter the URL of the image:');
		if ((url && !isImageUrl(url)) || !url) {
			alert('URL is not an image');
			return;
		}
		insertImage(editor, url);
	};
</script>

<Button {onClick}>
	<MdImage />
</Button>
