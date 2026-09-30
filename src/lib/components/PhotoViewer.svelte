<script>
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import PhotoNote from "./PhotoNote.svelte";

    export let src;
    export let note = '';
    export let topInset = 0; // height of the sticky page header

    const dispatch = createEventDispatcher();
    const close = () => dispatch('close');

    // The page behind stays visible and usable; a click anywhere outside the photo and
    // note closes it. Ignore the click that opened the viewer, which is still bubbling.
    const openedAt = performance.now();
    let unit;
    function handleWindowClick(e) {
        if (e.timeStamp <= openedAt) return;
        if (!unit.contains(e.target)) close();
    }

    // Double-click / double-tap the photo to close, same as the pile view
    let lastTapTime = 0;
    function handleClick() {
        const now = Date.now();
        if (now - lastTapTime < 300) close();
        lastTapTime = now;
    }
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && close()} on:click={handleWindowClick} />

<div
    class="viewer"
    style="top: {topInset}px; --available: calc(100dvh - {topInset}px);"
    in:fade={{ duration: 150 }}
>
    <div class="unit" class:with-note={!!note} bind:this={unit}>
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
        <img {src} alt="" on:click={handleClick} />
        {#if note}
            <div class="note-slot">
                <PhotoNote text={note} style="position: absolute; inset: 0;" />
            </div>
        {/if}
    </div>
</div>

<style>
    /* Positions the photo below the sticky header, matching the pile's expanded layout.
       Transparent and click-through so the grid stays visible and scrollable. */
    .viewer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1001; /* above the sticky page header (z-index 1000) */
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 25px;
        box-sizing: border-box;
    }

    .unit {
        display: flex;
        gap: 16px;
        pointer-events: auto;
    }

    img,
    .note-slot {
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    }

    img {
        display: block;
        max-height: var(--available);
        max-width: 100%;
        cursor: zoom-out;
    }

    .unit.with-note img {
        max-width: calc(100vw - 50px - 316px);
    }

    /* The note takes the photo's height and scrolls inside it */
    .note-slot {
        position: relative;
        width: 300px;
        flex-shrink: 0;
    }

    /* Narrow screens: note below the photo, same breakpoint as the pile */
    @media (max-width: 690px) {
        .unit.with-note {
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: var(--available);
        }
        .unit.with-note img {
            max-width: 100%;
            max-height: calc(var(--available) * 0.6);
        }
        .unit.with-note .note-slot {
            width: 100%;
            flex: 1;
            min-height: 0;
        }
    }
</style>
