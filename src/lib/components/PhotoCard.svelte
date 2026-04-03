<script>
    import { onMount, onDestroy } from "svelte";
    import { highestZIndex, incrementHighestZIndex } from "../store/store.js";

    export let maxY = undefined;

    const BASE_WIDTH = 280;
    const EXPANDED_WIDTH = 560;

    let width = BASE_WIDTH;
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

    onMount(() => {
        x = Math.random() * Math.max(0, window.innerWidth - BASE_WIDTH - 60);
        const yRange = (maxY ?? window.innerHeight) - 200;
        y = Math.random() * Math.max(0, yRange);
    });

    onDestroy(() => {
        window.removeEventListener('mousemove', onWindowMouseMove);
        window.removeEventListener('mouseup', onWindowMouseUp);
    });

    function onWindowMouseMove(event) {
        x = startCardX + (event.clientX - startMouseX);
        y = startCardY + (event.clientY - startMouseY);
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
        if (!isDragging) rotation = (Math.random() * 20) - 10;
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
        x = startCardX + (touch.clientX - startMouseX);
        y = startCardY + (touch.clientY - startMouseY);
    }

    function handleTouchEnd() {
        isDragging = false;
    }

    function handleClick() {
        const now = Date.now();
        if (now - lastTapTime < 300) {
            isExpanded = !isExpanded;
            width = isExpanded ? EXPANDED_WIDTH : BASE_WIDTH;
            if (isExpanded) {
                x = Math.max(20, (window.innerWidth - EXPANDED_WIDTH) / 2);
                y = window.scrollY + 40;
            }
        }
        lastTapTime = now;
    }
</script>

<button
    class="photocard"
    class:dragging={isDragging}
    style="
        position: absolute;
        width: {width}px;
        transform: translate({x}px, {y}px) rotate({rotation}deg);
        z-index: {zIndex};
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
    <slot></slot>
</button>

<style>
    button {
        border: none;
        background: none;
        padding: 0;
        overflow: hidden;
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
</style>
