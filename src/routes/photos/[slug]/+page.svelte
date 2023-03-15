<script>
	export let data;
</script>

<h1>{data.post.title}</h1>
<h2>{data.post.year}</h2>
{#each data.post.content as photo, i}
	<img src={photo} alt="" />
{/each}

<style>
	h1 {
		text-transform: capitalize !important;
	}
</style>
