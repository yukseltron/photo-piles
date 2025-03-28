<script>
    import img1 from '$lib/assets/tokyo/tokyo2.png';
    import img2 from '$lib/assets/tokyo/tokyo3.png';
    import img3 from '$lib/assets/seattle/2.jpeg';
    import img4 from '$lib/assets/seattle/8.jpeg';
    import img5 from '$lib/assets/istanbul/7.jpeg';
    import img6 from '$lib/assets/istanbul/9.jpeg';
    import img7 from '$lib/assets/losangeles/2.jpeg';
    import img8 from '$lib/assets/losangeles/6.jpeg';
    import { scale, fade } from 'svelte/transition';
    import PhotoCard from '$lib/components/PhotoCard.svelte';

    export let data;

    const images = [img1, img2, img3, img4, img5, img6, img7, img8]
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    const num = getRandomInt(1,8);

</script>

<br/>
<br/>
<PhotoCard>
    <div style="pointer-events: none; max-width: 100%; object-fit: contain;">
        <img in:scale src={images[num]} alt="random image" style="width:100%; height:100%; transition: all 1s;"/>
    </div>
</PhotoCard>
<div class="container">
    {#each data.summaries as { slug, title, }}
        <div>
            <a href="/{slug}">{title}</a>
        </div>
    {/each}
</div>

<style>

    .container {
        display: flex;
        flex-direction: column;
    }
    .handler {
        height: 500px;
        width: 500px;
        background-size: cover;
        background-position: center;
        overflow: hidden;
    }
    a {
        font-size: 2rem;
        color: var(--foreground);
        font-weight: 200;
        letter-spacing: 0.5rem;
        text-transform: uppercase;
    }
    a:hover {
        text-decoration-thickness: 5px;
    }
</style>