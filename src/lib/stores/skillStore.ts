import { writable } from "svelte/store";
import type { Skill } from "../api";
import { getContactSkills } from "../api";

const createSkillStore = () => {
    const { subscribe, set, update } = writable<Skill[]>([]);

    const fetchData = async () => {
        try {
            console.log("Fetching skills...");
            const data = await getContactSkills(import.meta.env.VITE_MY_CONTACT_ID as string);
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

export const skillStore = createSkillStore();

// export const getSkillById = (id: string) => {
//     skills.subscribe((skills) => {
//         return skills.find((skill) => skill.id === id);
//     });
// }
