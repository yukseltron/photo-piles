<script>
	export let data;
</script>

<h1>{data.post.title}</h1>
<h2>{data.post.subtitle}</h2>
<div>
	{#each data.post.content as photo, i}
		<img class={photo.width == 'full' ? 'full' : 'half'} src={photo.img} alt="" />
	{/each}
</div>


<style>
	h1 {
		text-transform: capitalize !important;
	}

	img {
		object-fit: cover;
		justify-content: stretch;
	}

	.full {
		width: 100%;
		transition: width 2s;
	}

	.half {
		width: 50%;
		transition: width 2s;
	}
	img {
		animation-name: grow;
		animation-duration: 4s;
  		animation-iteration-count: 1;
	}

	div {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 200px;
	}

	@media only screen and (max-width: 600px) {
		.half {
			width: 100%;
		}
	}

	@media only screen and (min-width: 2000px) {
		.half {
			width: 100%;
		}
	}

	@keyframes grow {
		0%  {
				width: 10%;
			}
		25%  {
				width: 20%;
		}
		75%  {
				width: 38%;
			}
		100%  {
				width: 50%;
		}
	}
</style>
