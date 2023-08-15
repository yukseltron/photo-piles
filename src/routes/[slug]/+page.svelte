<script>
	import PhotoCard from '$lib/components/PhotoCard.svelte';
	import { scale } from 'svelte/transition';

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
		<PhotoCard>
			<div style="pointer-events: none; max-width: 100%; object-fit: contain;">
				{#await renderNextComponent()}
					<div style="
						width: 50px;
						height: 50px;
						border-radius: 50%;
						background-color: {photo.color};
					" in:scale>
					</div>
				{:then}
					<img 
						in:scale 
						src={photo.img} 
						alt={photo.alt} 
						style="width:100%; height:100%; transition: all 1s;"
						on:load={() => renderNextComponent()} 
					/>
				{/await}
			</div>

		</PhotoCard>
	{/each}
</div>
