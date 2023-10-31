export interface DateRange {
    start: string;
    end?: string;
}

type ExperienceType = "work" | "volunteer" | "education" | "publication" | "project";

export interface _Experience {
    position: string;
    type?: ExperienceType;
    date: DateRange;
    company: string;
    location: string;
    summary?: string;
    highlights: string[];
    skills?: string[]; // could be a list of ids that relate to skills
}

export interface _Skill {
    id: string;
    name: string;
    level: string;
    keywords: string[];
}

export interface _Education {
    institution: string;
    location: string;
    degree: string;
    degreeType: string;
    date: DateRange;
    courses?: string[];
    summary?: string;
    activities?: string[];
}

export interface _Contact {
    name: string;
    title: string;
    email: string;
    phone?: string;
    github?: string;
    linkedin?: string;
    website?: string;
}

export interface _ResumeData {
    subject: _Contact;
    summary: string;
    experiences: _Experience[];
    skills: _Skill[];
    education: _Education[];
}