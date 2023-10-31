import { writable } from "svelte/store";
import type { Skill } from "../api-types";

type ActionType = "hover" | "click" | "none";

interface SelectAction<T> {
    item: T | null;
    type: ActionType;
}

export const selectedSkillStore = writable<SelectAction<Skill>>({
    item: null,
    type: "none",
});

// add other kinds of selection stores here
