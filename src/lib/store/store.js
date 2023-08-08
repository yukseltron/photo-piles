import { writable } from 'svelte/store';

export const highestZIndex = writable(100);

export function incrementHighestZIndex() {
  highestZIndex.update(value => value + 1);
}
