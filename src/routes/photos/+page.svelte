<script>
	export let data;
</script>

<h1>Photos</h1>

<ul>
	{#each data.summaries as { slug, title, }}
		<li><a href="/photos/{slug}">{slug}</a></li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
		list-style-type: none;
	}
</style>