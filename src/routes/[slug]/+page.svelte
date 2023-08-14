<script>
	import PhotoCard from '$lib/components/PhotoCard.svelte';
	import { lazyLoad } from '$lib/utility/lazyLoad.js';
	import { fade, blur, scale } from 'svelte/transition';

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
						width: 100px;
						height: 100px;
						border: 2px solid var(--foreground);
						border-radius: 50%;
						background-color: var(--background);
					" transition:scale>
					</div>
				{:then}
					<img transition:scale use:lazyLoad={photo.img} alt={photo.alt} style="width:100%; height:100%; transition: all 1s;"/>
				{/await}
			</div>

		</PhotoCard>
	{/each}
</div>
