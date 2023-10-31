import type { Experience } from "../api-types";

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

export interface TooltipState {
    showMenu: boolean;
    menuLocked: boolean;
    highlight: boolean;
    showLabel: boolean;
}

export const DefaultTooltipState : TooltipState = {
    showMenu: false,
    menuLocked: false,
    highlight: false,
    showLabel: false,
};

export interface DescriptionTooltipOptions {
    opacity: number;
    offsetX: number;
    offsetY: number;
    anchorSize: number;
}

export interface DescriptionPointOptions {
    nodeSize: number;
    hoverSizeMult: number;
    hoverSizeDurationMs: number;
    tooltipTransitionMs: number;
    tooltipOpacity: number;
    transitionMs: number;
}

export interface ExperiencePointOptions {
    nodeSize: number;
    hoverSizeMult: number;
    hoverSizeDecayMs: number;
    opacity: number;
    transitionMs: number;
}

export interface DescriptionMapOptions {
    descriptionPointOptions: DescriptionPointOptions;
    experiencePointOptions: ExperiencePointOptions;
    descriptionTooltipOptions: DescriptionTooltipOptions;
    experienceTooltipOptions: ExperienceTooltipOptions;
    margin: { top: number; right: number; bottom: number; left: number };
}



export interface ExperienceTooltipOptions {
    opacity: number;
    offsetX: number;
    offsetY: number;
    anchorSize: number;
}