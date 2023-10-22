import { writable } from "svelte/store";
import type { _Skill } from "./resume-types";

export const skillStore = writable<_Skill[]>([]);

export const idToSkill = writable<Record<string, _Skill>>({});