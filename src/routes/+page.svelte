<script>
    import { onMount } from 'svelte';
    import img1 from '$lib/assets/tokyo1.png';
    import img2 from '$lib/assets/tokyo2.png';
    import img3 from '$lib/assets/tokyo3.png';
    import img4 from '$lib/assets/tokyo4.png';

    const images = [img1, img2, img3, img4]
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    const num = getRandomInt(1,4);

</script>

<h1>Places You'll Go</h1>
<div class="handler">
    <img alt="The project logo" src={images[num]} />
</div>
<p>A collection of photo albums.</p>

<style>
    .handler {
        width: 100%;
        height: 500px;
        overflow: hidden;
    }

    .handler img {
        object-fit: contain;
    }
</style>