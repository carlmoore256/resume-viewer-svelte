import { get, writable } from "svelte/store";
import type { Experience } from "../api-types";
import { getExperiences } from "../api";

const createExperienceStore = () => {
    const { subscribe, set, update } = writable<Experience[]>([]);

    const fetchData = async (forEmail: string) => {
        console.log("Fetching experience data...")
        try {
            const data = await getExperiences(forEmail);
            set(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const randomizePositions = (amount : number) => {
        update(experiences => {
            return experiences.map(e => {
                return {
                    ...e,
                    descriptions: e.descriptions.map(d => {
                        return {
                            ...d,
                            reducedEmbedding: [
                                d.reducedEmbedding[0] + (Math.random() * amount),
                                d.reducedEmbedding[1] + (Math.random() * amount),
                            ],
                        };
                    }),
                };
            });
        })
    }

    // fetchData();

    return {
        subscribe,
        fetchData,
        set,
        randomizePositions
    };
};

export const experienceStore = createExperienceStore();
