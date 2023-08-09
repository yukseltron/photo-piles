<script>
	import PhotoCard from '$lib/PhotoCard.svelte';

	export let data;
	let currentIndex = 250;

	async function renderNextComponent() {
		currentIndex += 250;
		await new Promise(resolve => setTimeout(resolve, currentIndex)); // Wait for 1 second
  	}
</script>

<h1>{data.post.title}</h1>
<h2>{data.post.subtitle}</h2>
<div>
	{#each data.post.content as photo, i}
		{#await renderNextComponent()}
		•
		{:then}
			<PhotoCard>
				<div style="pointer-events: none; max-width: 100%; object-fit: contain;">
					<img src={photo.img} alt={photo.alt} style="width:100%; height:100%;"/>
				</div>
			</PhotoCard>
		{/await}
	{/each}
</div>
