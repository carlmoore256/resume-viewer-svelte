import { get, writable } from "svelte/store";
import type { Experience } from "../api";
import { getExperiences } from "../api";

const createExperienceStore = () => {
    const { subscribe, set, update } = writable<Experience[]>([]);

    const fetchData = async () => {
        try {
            const data = await getExperiences();
            set(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();

    return {
        subscribe,
        fetchData,
        set,
    };
};

export const experienceStore = createExperienceStore();
