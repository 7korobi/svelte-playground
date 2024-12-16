<script lang="ts">
	import Header from '../../Header.svelte';
	import Counter from '../../Counter.svelte';
	let { data } = $props();
	let { com } = data;
</script>

{#if com === 'Header'}
	<Header />
{:else if com === 'Counter'}
	<Counter />
{:else}
	<div class="else"></div>
{/if}
