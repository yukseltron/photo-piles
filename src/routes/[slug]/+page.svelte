<script>
	import PhotoCard from '$lib/components/PhotoCard.svelte';
	import { scale } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';

	export let data;

	let isGrid = false;
	const pileHeight = Math.ceil(data.images.length / 4) * 350;

	// Track which pile images have finished loading
	let loadedSet = new Set();
	function onLoad(i) {
		loadedSet.add(i);
		loadedSet = loadedSet;
	}

	function toggleView() {
		isGrid = !isGrid;
		loadedSet = new Set();
	}

	// Grid zoom via pinch / ctrl+scroll
	const MIN_COL = 100;
	const MAX_COL = 800;
	let columnWidth = 240;
	let gridEl;
	let lastPinchDist = null;

	function handleWheel(e) {
		if (!e.ctrlKey && !e.metaKey) return;
		e.preventDefault();
		columnWidth = Math.min(MAX_COL, Math.max(MIN_COL, columnWidth - e.deltaY * 0.8));
	}

	function pinchDist(touches) {
		const dx = touches[0].clientX - touches[1].clientX;
		const dy = touches[0].clientY - touches[1].clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function handleTouchStart(e) {
		if (e.touches.length === 2) lastPinchDist = pinchDist(e.touches);
	}

	function handleTouchMove(e) {
		if (e.touches.length !== 2 || lastPinchDist === null) return;
		e.preventDefault();
		const dist = pinchDist(e.touches);
		columnWidth = Math.min(MAX_COL, Math.max(MIN_COL, columnWidth + (dist - lastPinchDist) * 0.8));
		lastPinchDist = dist;
	}

	function handleTouchEnd() {
		lastPinchDist = null;
	}

	onMount(() => {
		gridEl.addEventListener('wheel', handleWheel, { passive: false });
		gridEl.addEventListener('touchstart', handleTouchStart, { passive: true });
		gridEl.addEventListener('touchmove', handleTouchMove, { passive: false });
		gridEl.addEventListener('touchend', handleTouchEnd, { passive: true });
	});

	onDestroy(() => {
		if (!gridEl) return;
		gridEl.removeEventListener('wheel', handleWheel);
		gridEl.removeEventListener('touchstart', handleTouchStart);
		gridEl.removeEventListener('touchmove', handleTouchMove);
		gridEl.removeEventListener('touchend', handleTouchEnd);
	});
</script>

<div class="page-header">
	<h1>
		{data.country.title}{#if data.country.localName && data.country.localName !== data.country.title}<span class="local-name">{data.country.localName}</span>{/if}
	</h1>
	<div class="controls">
		{#if isGrid}
			<input
				type="range"
				min={MIN_COL}
				max={MAX_COL}
				step="10"
				bind:value={columnWidth}
				aria-label="Image size"
			/>
		{/if}
		<button class="view-toggle" on:click={toggleView} aria-label="Toggle view">
			<div class="icon" class:is-grid={isGrid}>
				<span class="sq" /><span class="sq" /><span class="sq" /><span class="sq" />
			</div>
		</button>
	</div>
</div>

<!-- gridEl is always mounted so listeners are always attached; hidden when in pile mode -->
<div
	class="grid-view"
	class:hidden={!isGrid}
	bind:this={gridEl}
	style="columns: {columnWidth}px;"
>
	{#each data.images as img}
		<img src={img} alt="" loading="lazy" />
	{/each}
</div>

{#if !isGrid}
	<div class="pile-view" style="height: {pileHeight}px;">
		{#each data.images as img, i}
			<PhotoCard maxY={pileHeight}>
				<div class="card-content" style="pointer-events: none;">
					<div
						class="placeholder"
						class:hidden={loadedSet.has(i)}
						style="background-color: {data.country.color};"
						in:scale
					/>
					<img
						src={img}
						alt=""
						loading="lazy"
						on:load={() => onLoad(i)}
						class:visible={loadedSet.has(i)}
					/>
				</div>
			</PhotoCard>
		{/each}
	</div>
{/if}

<style>
	.page-header {
		width: 100%;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	input[type="range"] {
		-webkit-appearance: none;
		appearance: none;
		width: 80px;
		height: 2px;
		background: var(--foreground);
		opacity: 0.2;
		border-radius: 2px;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	input[type="range"]:hover {
		opacity: 0.5;
	}
	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--foreground);
		cursor: pointer;
	}
	input[type="range"]::-moz-range-thumb {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--foreground);
		border: none;
		cursor: pointer;
	}

	.local-name {
		font-size: 0.55em;
		font-weight: 200;
		opacity: 0.4;
		margin-left: 0.4em;
		letter-spacing: 0.03em;
	}

	/* Toggle button */
	.view-toggle {
		background: none;
		border: none;
		cursor: pointer;
		padding: 6px;
		color: var(--foreground);
		opacity: 0.4;
		transition: opacity 0.2s;
		flex-shrink: 0;
	}
	.view-toggle:hover { opacity: 1; }

	.icon {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3px;
		width: 18px;
		height: 18px;
	}
	.sq {
		width: 7px;
		height: 7px;
		background: currentColor;
		display: block;
		transition: transform 0.3s ease;
	}
	.icon:not(.is-grid) .sq:nth-child(1) { transform: rotate(-12deg) translate(-1px,  3px); }
	.icon:not(.is-grid) .sq:nth-child(2) { transform: rotate(  8deg) translate( 2px,  1px); }
	.icon:not(.is-grid) .sq:nth-child(3) { transform: rotate( 15deg) translate( 1px, -2px); }
	.icon:not(.is-grid) .sq:nth-child(4) { transform: rotate( -6deg) translate(-2px,  2px); }

	/* Grid */
	.grid-view {
		width: 100%;
		gap: 8px;
		column-gap: 8px;
	}
	.grid-view.hidden {
		display: none;
	}
	.grid-view img {
		width: 100%;
		display: block;
		margin-bottom: 8px;
		break-inside: avoid;
	}

	/* Pile */
	.pile-view {
		position: relative;
		width: 100%;
	}

	.card-content {
		position: relative;
		width: 100%;
		min-height: 180px;
	}

	.placeholder {
		position: absolute;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		top: 20px;
		left: 20px;
		opacity: 1;
		transition: opacity 0.4s ease;
		pointer-events: none;
	}
	.placeholder.hidden {
		opacity: 0;
	}

	.card-content img {
		width: 100%;
		display: block;
		opacity: 0;
		transition: opacity 0.6s ease;
	}
	.card-content img.visible {
		opacity: 1;
	}
</style>
