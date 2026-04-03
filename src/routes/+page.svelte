<script>
    export let data;

    const covers = data.summaries.filter(s => s.cover).map(s => s.cover);
    let bgImage = covers[Math.floor(Math.random() * covers.length)] ?? '';

    function setBackground(cover) {
        if (cover) bgImage = cover;
    }
</script>

<div class="handler" style="background-image: url({bgImage})"></div>

{#each data.summaries as { slug, title, count, cover }}
    <div class="entry">
        <a href="/{slug}" on:mouseenter={() => setBackground(cover)}>
            {title}
        </a>
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

    .entry {
        display: flex;
        align-items: baseline;
        gap: 0.6rem;
        margin-bottom: 0.5rem;
    }

    a {
        font-size: 2rem;
        color: var(--foreground);
        font-weight: 200;
        line-height: 3rem;
    }
</style>
