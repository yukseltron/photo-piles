import { writable } from 'svelte/store';

export const highestZIndex = writable(100);

export function incrementHighestZIndex() {
  highestZIndex.update(value => value + 1);
}

// The one card currently expanded (with its note); expanding another collapses it
export const expandedCard = writable(null);
