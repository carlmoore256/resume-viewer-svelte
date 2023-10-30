import type { Skill } from "./api";

export interface CategorySkills {
    category: string;
    skills: Skill[];
}