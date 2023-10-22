import { writable } from "svelte/store";

interface ElementStoreItem {
    key: string;
    type: string;
    element: HTMLElement;
}

export const elementStore = writable<ElementStoreItem[]>([]);

export const getAllElementsWithKey = (elements: ElementStoreItem[], key: string) => {
    return elements.filter(e => e.key === key);
}

export const getElement = (elements : ElementStoreItem[], key: string, type: string) => {
    return elements.find(e => e.key === key && e.type === type);
}


// export const elementStore = writable<ElementStoreItem[]>([]);
