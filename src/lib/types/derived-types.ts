import type { Skill } from "../api-types";

export interface CategorySkills {
    category: string;
    skills: Skill[];
}