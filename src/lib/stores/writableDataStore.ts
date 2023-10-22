import { writable, derived } from "svelte/store";

// The initial state of the store is an empty object
const createDataStore = () => {
    const { subscribe, set, update } = writable<Record<string, any>>({});

    return {
        subscribe,
        set,
        setData: (id: string, data: any) =>
            update((store) => {
                store[id] = data;
                return store;
            }),
        upsertData: (id: string, data: any) =>
            update((store) => {
                if (!store[id]) store[id] = {};
                store[id] = { ...store[id], ...data };
                return store;
            }),
        getData: (id: string) => {
            let data;
            subscribe((store) => {
                data = store[id];
            })();
            return data;
        },
        removeData: (id: string) =>
            update((store) => {
                delete store[id];
                return store;
            }),
        clearAll: () => set({}),
    };
};

export const writableDataStore = createDataStore();


export function storeForId(id: string) {
    return derived(writableDataStore, $store => $store[id]);
}