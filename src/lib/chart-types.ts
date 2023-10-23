
export interface DescriptionPoint {
    id: string;
    x: number;
    y: number;
    cluster: number;
    text: string;
    experienceName: string;
    experienceOrg: string;
    experienceLocation: string;
    startDate: string;
    endDate: string;
}

export interface ExperienceCenter {
    name: string;
    center: { x: number; y: number };
    radius: number;
}

export interface TooltipContent {
    title: string;
    subtitle?: string;
    html?: string;
    style?: any;
}