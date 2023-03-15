<script>
	export let data;
</script>

<h1>{data.post.title}</h1>
<h2>{data.post.subtitle}</h2>
<div>
	{#each data.post.content as photo, i}
		<img src={photo} alt="" />
	{/each}
</div>


<style>
	h1 {
		text-transform: capitalize !important;
	}

	img {
		width: 50%;
		object-fit: cover;
		justify-content: stretch;
	}

	div {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 200px;
	}

	@media only screen and (max-width: 800px) {
		img {
			width: 100%;
		}
	}

	@media only screen and (min-width: 1900px) {
		img {
			width: 100%;
		}
	}
</style>
