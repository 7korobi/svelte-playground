<script lang="ts">
	import Header from '../Header.story.svelte';
	import Counter from '../Counter.story.svelte';
	const Targets = { Header, Counter } as const;

	let { data } = $props();
	let Target = $derived(Targets[data.com as keyof typeof Targets]);
</script>

<div class="box">
	<div class="target">
		{#if undefined === Target}
			<div class="else"></div>
		{:else}
			<Target />
		{/if}
	</div>

	<div class="menu-box">
		{#each Object.keys(Targets) as com}
			{#if com === data.com}
				<p class="menu">
					<span>{com}</span>
				</p>
			{:else}
				<p class="menu">
					<a href="/story/{com}">{com}</a>
				</p>
			{/if}
		{:else}
			<p>empty story.svelte</p>
		{/each}
	</div>
</div>

<style>
	.box {
		display: flex;
		align-items: stretch;
		flex-direction: row-reverse;
	}

	.target {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
		flex-direction: column;
	}
	.menu-box {
		padding: 10px;
		border: 1px solid #ccc;
		border-style: solid solid none none;
	}
	.menu {
		padding: 2px 10px;
		margin: 0;
		border-bottom: 1px solid #ccc;
		span {
			font-weight: bold;
		}
	}
</style>
