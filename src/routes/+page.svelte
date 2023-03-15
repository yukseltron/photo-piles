<script>
    import img1 from '$lib/assets/tokyo/tokyo2.png';
    import img2 from '$lib/assets/tokyo/tokyo3.png';
    import img3 from '$lib/assets/seattle/2.jpeg';
    import img4 from '$lib/assets/seattle/8.jpeg';
    import img5 from '$lib/assets/istanbul/7.jpeg';
    import img6 from '$lib/assets/istanbul/9.jpeg';
    import img7 from '$lib/assets/losangeles/2.jpeg';
    import img8 from '$lib/assets/losangeles/6.jpeg';

    const images = [img1, img2, img3, img4, img5, img6, img7, img8]
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    const num = getRandomInt(1,8);

</script>

<h1>A Photo Garden</h1>
<div class="handler">
    <img alt="The project logo" src={images[num]} />
</div>

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