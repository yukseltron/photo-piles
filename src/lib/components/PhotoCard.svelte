<script>
    import { onMount, onDestroy } from "svelte";
    import { highestZIndex, incrementHighestZIndex, expandedCard } from "../store/store.js";
    import PhotoNote from "./PhotoNote.svelte";

    export let maxY = undefined;
    export let aspectRatio = undefined; // width / height, known once the image loads
    export let note = ''; // optional context shown beside the photo when expanded
    export let topInset = 0; // height of the sticky page header covering the top of the viewport

    const BASE_WIDTH = 280;
    const EXPANDED_WIDTH = 560;
    const NOTE_WIDTH = 300;
    const NOTE_GAP = 16;
    const STACK_BELOW = 640; // pile widths under this put the note below the photo
    const EXPANDED_Z = 1001; // above the sticky page header (z-index 1000)

    let innerHeight = 0;
    let el;
    let expandedWidth = EXPANDED_WIDTH;
    let stacked = false;
    let noteBox = '';
    let x = 0;
    let y = 0;
    let rotation = (Math.random() * 20) - 10;
    let isDragging = false;
    let zIndex = 1;

    // Delta-based drag — immune to coordinate system mismatches
    let startMouseX = 0;
    let startMouseY = 0;
    let startCardX = 0;
    let startCardY = 0;

    // Double-tap
    let lastTapTime = 0;
    let isExpanded = false;

    // Narrow the card for tall images so they never exceed the viewport height;
    // when expanded, the size is computed on double-click to fill the viewport height
    $: collapsedWidth = aspectRatio && innerHeight
        ? Math.min(BASE_WIDTH, innerHeight * aspectRatio)
        : BASE_WIDTH;
    $: width = isExpanded ? expandedWidth : collapsedWidth;
    $: showNote = isExpanded && !!note;

    // Only one card is expanded at a time: collapse when another card takes over
    const id = {};
    const unsubscribeExpanded = expandedCard.subscribe(current => {
        if (isExpanded && current !== id) collapse();
    });

    function collapse() {
        isExpanded = false;
        x = clamp(x, 0, window.innerWidth - BASE_WIDTH);
    }

    onMount(() => {
        x = Math.random() * Math.max(0, window.innerWidth - BASE_WIDTH - 60);
        const yRange = (maxY ?? window.innerHeight) - 200;
        y = Math.random() * Math.max(0, yRange);
    });

    onDestroy(() => {
        unsubscribeExpanded();
        if (typeof window === 'undefined') return;
        window.removeEventListener('mousemove', onWindowMouseMove);
        window.removeEventListener('mouseup', onWindowMouseUp);
    });

    function clamp(val, min, max) {
        return Math.min(max, Math.max(min, val));
    }

    function onWindowMouseMove(event) {
        x = clamp(startCardX + (event.clientX - startMouseX), 0, window.innerWidth - width);
        y = clamp(startCardY + (event.clientY - startMouseY), 0, (maxY ?? window.innerHeight) - 100);
    }

    function onWindowMouseUp() {
        isDragging = false;
        window.removeEventListener('mousemove', onWindowMouseMove);
        window.removeEventListener('mouseup', onWindowMouseUp);
    }

    function handleMouseDown(event) {
        event.preventDefault();
        isDragging = true;
        startMouseX = event.clientX;
        startMouseY = event.clientY;
        startCardX = x;
        startCardY = y;
        incrementHighestZIndex();
        zIndex = $highestZIndex;
        window.addEventListener('mousemove', onWindowMouseMove);
        window.addEventListener('mouseup', onWindowMouseUp);
    }

    function handleMouseEnter() {
        if (!isDragging) rotation = 0;
    }

    function handleMouseLeave() {
        if (!isDragging && !isExpanded) rotation = (Math.random() * 20) - 10;
    }

    function handleTouchStart(event) {
        const touch = event.touches[0];
        isDragging = true;
        startMouseX = touch.clientX;
        startMouseY = touch.clientY;
        startCardX = x;
        startCardY = y;
        incrementHighestZIndex();
        zIndex = $highestZIndex;
    }

    function handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        x = clamp(startCardX + (touch.clientX - startMouseX), 0, window.innerWidth - width);
        y = clamp(startCardY + (touch.clientY - startMouseY), 0, (maxY ?? window.innerHeight) - 100);
    }

    function handleTouchEnd() {
        isDragging = false;
    }

    function handleClick() {
        const now = Date.now();
        if (now - lastTapTime < 300) {
            if (isExpanded) {
                expandedCard.set(null);
            } else {
                isExpanded = true;
                expandedCard.set(id);
                rotation = 0;
                // Bring the top of the pile into view if needed, then center the card in the
                // visible area below the sticky header
                const pileTop = el.offsetParent.getBoundingClientRect().top;
                if (pileTop > topInset) window.scrollBy(0, pileTop - topInset);
                const pile = el.offsetParent.getBoundingClientRect();
                const vh = window.innerHeight - topInset;

                // Leave room for the note: beside the photo, or below it on narrow screens
                stacked = !!note && pile.width < STACK_BELOW;
                let maxW = pile.width;
                let maxH = vh;
                if (note && stacked) maxH = vh * 0.6;
                else if (note) maxW = pile.width - NOTE_WIDTH - NOTE_GAP;

                expandedWidth = aspectRatio
                    ? Math.min(maxW, maxH * aspectRatio)
                    : Math.min(maxW, EXPANDED_WIDTH);
                const photoHeight = aspectRatio ? expandedWidth / aspectRatio : 0;

                let unitWidth = expandedWidth;
                let unitHeight = photoHeight;
                if (note && stacked) {
                    unitWidth = pile.width;
                    unitHeight = vh;
                    noteBox = `width: ${pile.width}px; height: ${vh - photoHeight - NOTE_GAP}px;`;
                } else if (note) {
                    unitWidth = expandedWidth + NOTE_GAP + NOTE_WIDTH;
                    noteBox = `width: ${NOTE_WIDTH}px; height: ${photoHeight || vh}px;`;
                }

                x = clamp((window.innerWidth - unitWidth) / 2 - pile.left, 0, pile.width - unitWidth);
                y = Math.max(0, topInset + (vh - unitHeight) / 2 - pile.top);
            }
        }
        lastTapTime = now;
    }
</script>

<svelte:window bind:innerHeight />

<button
    bind:this={el}
    class="photocard"
    class:dragging={isDragging}
    class:stacked={showNote && stacked}
    class:with-note={showNote}
    style="
        position: absolute;
        transform: translate({x}px, {y}px) rotate({rotation}deg);
        z-index: {isExpanded ? EXPANDED_Z : zIndex};
    "
    on:mousedown={handleMouseDown}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
    on:click={handleClick}
    tabindex="0"
>
    <div class="photo" style="width: {width}px;">
        <slot></slot>
    </div>
    {#if showNote}
        <PhotoNote text={note} style={noteBox} />
    {/if}
</button>

<style>
    button {
        border: none;
        background: none;
        padding: 0;
        display: flex;
        align-items: flex-start;
        gap: 16px;
        transform-origin: top left;
        transition: transform 0.5s ease, box-shadow 0.2s ease;
        cursor: grab;
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
    }

    button.dragging {
        transition: box-shadow 0.2s ease;
        cursor: grabbing;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }

    button:focus {
        outline: none;
    }

    /* Fill the gap between photo and note so cards underneath don't peek through */
    button.with-note {
        background: var(--background);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    }

    button.stacked {
        flex-direction: column;
        align-items: center;
    }

    .photo {
        overflow: hidden;
        flex-shrink: 0;
    }

</style>
