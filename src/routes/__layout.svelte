<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<meta name="description" content={PACKAGE_JSON.description} />
	<meta name="keywords" content={PACKAGE_JSON.keywords.join(', ')} />
</svelte:head>

<slot />
