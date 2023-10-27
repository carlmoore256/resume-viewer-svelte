import type { Experience } from "./api";
export interface DescriptionPoint {
    id: string;
    x: number;
    y: number;
    cluster: number;
    text: string;
    experience: Experience;
    skillIds: string[];
    // experienceName: string;
    // experienceOrg: string;
    // experienceLocation: string;
    // startDate: string;
    // endDate: string;
}

export interface ExperienceCenter {
    name: string;
    center: { x: number; y: number };
    radius: number;
}

export interface TooltipContent {
    title: string;
    subtitle?: string;
    style?: any;
}


export interface DescriptionTooltipProps {
    data: DescriptionPoint;
    position: { x: number; y: number };
    color: string;
}