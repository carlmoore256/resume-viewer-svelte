import { writable } from "svelte/store";
import type { Skill } from "./resume-types";

export const skillStore = writable<Skill[]>([]);

export const idToSkill = writable<Record<string, Skill>>({});