import { writable } from "svelte/store";
import type { Skill } from "../api";
import { getContactSkills, createSkill } from "../api";

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

    const addSkill = async (name: string, contactId: string) => {
        try {
            console.log("Creating skill...", name, contactId);
            const data = await createSkill(name, contactId);
            update((skills) => [...skills, data]);
        } catch (error) {
            console.error("Error creating skill:", error);
        }
    };


    fetchData();

    return {
        subscribe,
        fetchData,
        set,
        addSkill,
    };
};

export const skillStore = createSkillStore();

// export const getSkillById = (id: string) => {
//     skills.subscribe((skills) => {
//         return skills.find((skill) => skill.id === id);
//     });
// }
