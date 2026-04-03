<script>
    import { scale } from 'svelte/transition';

    export let data;

    let bgImage = data.summaries.find(s => s.cover)?.cover ?? '';

    function setBackground(cover) {
        if (cover) bgImage = cover;
    }
</script>

<div in:scale class="handler" style="background-image: url({bgImage})"></div>

{#each data.summaries as { slug, title, count, cover }}
    <div class="entry">
        <a href="/{slug}" on:mouseenter={() => setBackground(cover)}>
            {title}
        </a>
        {#if count > 0}<span class="count">{count}</span>{/if}
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
        transition: background-image 0.4s ease;
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

    .count {
        font-size: 0.6rem;
        font-weight: 400;
        opacity: 0.35;
        letter-spacing: 0.05em;
    }
</style>
