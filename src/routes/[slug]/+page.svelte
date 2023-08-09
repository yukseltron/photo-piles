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
				<div style="pointer-events: none; width: 100%; height: 100%;">
					<img src={photo.img} alt="Photo" />
				</div>
			</PhotoCard>
		{/await}
	{/each}
</div>
