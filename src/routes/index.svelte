<script lang="ts">
	import type { IElement, IText } from '@aicacia/svelte-editor';
	import { Editor } from '@aicacia/svelte-editor';

	let value: Array<IText | IElement> = [
		{
			type: 'paragraph',
			children: [
				{ text: 'This is editable ' },
				{ text: 'rich', bold: true },
				{ text: ' text, ' },
				{ text: 'much', italic: true },
				{ text: ' better than a ' },
				{ text: '<textarea>', code: true },
				{ text: '!' }
			]
		},
		{
			type: 'image',
			url: 'https://source.unsplash.com/kFrdX5IeQzI',
			children: [{ text: '' }]
		},
		{
			type: 'paragraph',
			children: [
				{
					text: "Since it's rich text, you can do things like turn a selection of text "
				},
				{ text: 'bold', bold: true },
				{
					text: ', or add a semantically rendered block quote in the middle of the page, like this:'
				}
			]
		},
		{
			type: 'block-quote',
			children: [{ text: 'A wise quote.' }]
		},
		{
			type: 'paragraph',
			children: [{ text: 'Try it out for yourself!' }]
		}
	];
</script>

<div class="container">
	<Editor bind:value />
</div>

<style>
	.container {
		max-width: 768px;
		margin: 0 auto;
	}
</style>
