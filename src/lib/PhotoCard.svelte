<script>
    import { onMount } from "svelte";
    import { highestZIndex, incrementHighestZIndex } from "./store/store.js";

    let deg = Math.random() * 360;
    let rotation = deg;
    let width = "500px";
    let height = "600px";
    let x = 0;
    let y = 0;
    let isDragging = false;
    let zIndex = 1;
    let offsetX = 0;
    let offsetY = 0;
    
    // Double-tap handling
    let lastTapTime = 0;
    let tapTimeout;
    let isExpanded = false;
    let originalWidth;
    let originalHeight;

    onMount(() => {
        x = Math.random() * (window.innerWidth - 400);
        y = Math.random() * (window.innerHeight - 400);
    });

    function handleMouseDown(event) {
        isDragging = true;
        offsetX = event.clientX - x;
        offsetY = event.clientY - y;
        incrementHighestZIndex();
        zIndex = $highestZIndex;
    }

    function handleMouseMove(event) {
        if (isDragging) {
            x = event.clientX - offsetX;
            y = event.clientY - offsetY;
        }
        const closerValue = value => (Math.abs(value - 0) < Math.abs(value - 360)) ? 0 : 360;

        rotation = closerValue(deg);
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function handleMouseLeave() {
        isDragging = false;
        const randomNum = (Math.random() * 90) - 45;
        rotation += randomNum;
    }
    
    function handleTouchStart(event) {
        if (event.touches.length === 1) {
            handleMouseDown(event.touches[0]);
        }
    }

    function handleTouchMove(event) {
        if (event.touches.length === 1) {
            handleMouseMove(event.touches[0]);
        }
    }

    function handleTouchEnd() {
        handleMouseUp();
    }
    
    function handleTap() {
        console.log('click');
        const now = Date.now();
        if (now - lastTapTime < 300) {
            clearTimeout(tapTimeout);

            if (!isExpanded) {
                isExpanded = true;
                originalWidth = width;
                originalHeight = height;
                width = "800px";
                height = "900px";
                // Center the image
                x = (window.innerWidth - parseInt(width)) / 2;
                y = (window.innerHeight - parseInt(height)) / 2;
            } else {
                isExpanded = false;
                width = originalWidth;
                height = originalHeight;
            }
        } else {
            lastTapTime = now;
            tapTimeout = setTimeout(() => {
                clearTimeout(tapTimeout);
            }, 300);
        }
    }
</script>
  
<div
    class="photocard"
    style="
        position: absolute; 
        width: fit-content;
        min-width: 100px;
        max-width: {width}; 
        max-height: {height};
        left: {x}px; 
        top: {y}px; 
        transform: rotate({rotation}deg ); 
        z-index: {zIndex};
    "
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:mouseleave={handleMouseLeave}
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
    on:click={handleTap}
    >
    <slot></slot>
</div>
  
<style>
    .photocard {
        transform-origin: center;
        transition: transform 1s;
        cursor: grab;
    }
    .photocard:active {
        cursor: grabbing;
    }
    .photocard:hover {
        z-index: 2;
    }
</style>
  