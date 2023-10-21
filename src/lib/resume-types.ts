export interface DateRange {
    start: string;
    end?: string;
}

type ExperienceType = "work" | "volunteer" | "education" | "publication" | "project";

export interface Experience {
    position: string;
    type?: ExperienceType;
    date: DateRange;
    company: string;
    location: string;
    summary?: string;
    highlights: string[];
    skills?: string[]; // could be a list of ids that relate to skills
}

export interface Skill {
    id: string;
    name: string;
    level: string;
    keywords: string[];
}

export interface Education {
    institution: string;
    location: string;
    degree: string;
    degreeType: string;
    date: DateRange;
    courses?: string[];
    summary?: string;
    activities?: string[];
}

export interface Contact {
    name: string;
    title: string;
    email: string;
    phone?: string;
    github?: string;
    linkedin?: string;
    website?: string;
}

export interface ResumeData {
    subject: Contact;
    summary: string;
    experiences: Experience[];
    skills: Skill[];
    education: Education[];
}