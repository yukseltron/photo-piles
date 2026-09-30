<script>
    export let text = '';
    export let style = '';
</script>

<!-- Stop events so the note can be scrolled and selected without dragging, collapsing or closing the photo -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="note"
    {style}
    on:mousedown|stopPropagation
    on:touchstart|stopPropagation
    on:touchmove|stopPropagation
    on:click|stopPropagation
>{text}</div>

<style>
    .note {
        box-sizing: border-box;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 16px 18px;
        background: var(--background);
        color: var(--foreground);
        border: 1px solid color-mix(in srgb, var(--foreground) 20%, transparent);
        font: inherit;
        font-size: 15px;
        line-height: 1.6;
        text-align: left;
        white-space: pre-line;
        cursor: auto;
        user-select: text;
        -webkit-user-select: text;
        touch-action: pan-y;
    }
</style>
