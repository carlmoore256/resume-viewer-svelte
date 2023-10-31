import { writable } from "svelte/store";
import type { Experience } from "../api-types";
import { getExperiences } from "../api";

export interface ExperienceElementStore {
    id: string;
    data: Experience;
    elements: {
        key: string;
        element: HTMLElement;
    }[];
}

const createExperienceElementStore = () => {
    const { subscribe, set, update } = writable<ExperienceElementStore[]>([]);

    // Function to fetch data from API and update the store
    const fetchData = async (forEmail: string) => {
        try {
            const data = await getExperiences(forEmail);
            set(
                data.map((d) => {
                    return {
                        id: d.id,
                        data: d,
                        elements: [],
                    };
                })
            ); // or use your logic to properly update the store based on the fetched data
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle the error appropriately
        }
    };

    // Fetch data when store is initialized
    // fetchData();

    return {
        subscribe,
        fetchData,
        set,
        setItem: (id: string, data: any) =>
            update((items) => {
                const index = items.findIndex((item) => item.id === id);
                if (index === -1) {
                    items.push({ id, data, elements: [] });
                } else {
                    items[index].data = data;
                }
                return items;
            }),
        addElement: (id: string, key: string, element: HTMLElement) =>
            update((items) => {
                const index = items.findIndex((item) => item.id === id);
                if (index === -1) {
                    items.push({
                        id,
                        data: items[index].data,
                        elements: [{ key, element }],
                    });
                } else {
                    items[index].elements.push({ key, element });
                }
                return items;
            }),
        updateData: (id: string, newData: any) =>
            update((items) => {
                const index = items.findIndex((item) => item.id === id);
                if (index !== -1) {
                    items[index].data = newData;
                }
                return items;
            }),
        removeElement: (id: string, key: string) =>
            update((items) => {
                const index = items.findIndex((item) => item.id === id);
                if (index !== -1) {
                    const elIndex = items[index].elements.findIndex(
                        (el) => el.key === key
                    );
                    if (elIndex !== -1) {
                        items[index].elements.splice(elIndex, 1);
                    }
                }
                return items;
            }),
        removeItem: (id: string) =>
            update((items) => {
                return items.filter((item) => item.id !== id);
            }),
    };
};

export const experienceDataStore = createExperienceElementStore();
