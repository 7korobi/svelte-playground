<script lang="ts">
	import Header from '../Header.story.svelte';
	import Counter from '../Counter.story.svelte';
	let { data } = $props();
	let com = $derived(({ Header, Counter } as const)[data.com]);
</script>

{#if undefined === com}
	<div class="else"></div>
{:else}
	<svelte:component this={com} />
{/if}

<div>
	<a href="/story/Header">Header</a>
	<a href="/story/Counter">Counter</a>
</div>
