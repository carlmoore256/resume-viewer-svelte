import { writable } from "svelte/store";
import type { Skill } from "../api";
import { getContactSkills, createSkill } from "../api";
import type { CategorySkills } from "../derived-types";

const createSkillStore = () => {
    const { subscribe, set, update } = writable<Skill[]>([]);

    const fetchData = async (forEmail: string) => {
        try {
            console.log("Fetching skills...");
            const data = await getContactSkills(forEmail);
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

    return {
        subscribe,
        fetchData,
        set,
        addSkill,
    };
};

export const skillStore = createSkillStore();

export function getCategorySkills(skills: Skill[]) {
    const categories = new Set(
        skills
            .map((skill) => skill.category)
            .filter(Boolean)
            .sort() as string[]
    );

    const categorySkills: CategorySkills[] = [];
    categories.forEach((category) => {
        const skillsInCategory = skills.filter(
            (skill) => skill.category === category
        );
        categorySkills.push({
            category,
            skills: skillsInCategory,
        });
    });

    return categorySkills;
}