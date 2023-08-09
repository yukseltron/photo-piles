<script>
    import img1 from '$lib/assets/tokyo/tokyo2.png';
    import img2 from '$lib/assets/tokyo/tokyo3.png';
    import img3 from '$lib/assets/seattle/2.jpeg';
    import img4 from '$lib/assets/seattle/8.jpeg';
    import img5 from '$lib/assets/istanbul/7.jpeg';
    import img6 from '$lib/assets/istanbul/9.jpeg';
    import img7 from '$lib/assets/losangeles/2.jpeg';
    import img8 from '$lib/assets/losangeles/6.jpeg';

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
<div class="handler" 
    style="
        background-image: url({images[num]});
    "
>
</div>
{#each data.summaries as { slug, title, }}
    <div>
        <a href="/{slug}">{title}</a>
    </div>
{/each}

<style>
    .handler {
        position: absolute;
        height: 80vh;
        width: 50%;
        background-size: cover;
        background-position: center;
        right: 0;
        z-index: -500;
        overflow: hidden;
    }

    div {
        margin-bottom: 25px;
    }

    a {
        font-size: 3rem;
        color: var(--foreground);
        font-weight: 200;
        line-height: 3rem;
    }
</style>