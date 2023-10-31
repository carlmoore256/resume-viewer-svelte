export type Description = {
    id: string;
    text: string;
    reducedEmbedding: number[];
    kmeansLabel: number | null;
};

export type Skill = {
    id: string;
    name: string;
    startDate: Date | null;
    contactId: string;
    descriptionId: string | null;
    isGenerated: boolean | null;
    category: string | null;
    keywords: string[];
};

export type ExperienceType =
    | "Work"
    | "Volunteer"
    | "Project"
    | "Internship"
    | "Education"
    | "Other";

export type Experience = {
    id: string;
    name: string;
    type: ExperienceType;
    organizationId: string | null;
    contactId: string;
    startDate: string;
    endDate: string | null;
};

export type Contact = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    title: string | null;
    phone: string | null;
    github: string | null;
    linkedin: string | null;
    website: string | null;
};

export type Organization = {
    id: string;
    name: string;
    location: string | null;
};

export type Education = {
    id: string;
    degree: string;
    degreeType: string | null;
    area: string | null;
    gpa: number | null;
    courses: string[];
};

export interface WorkExperience {
    experience: Experience;
    organization: Organization | null;
    descriptions: { description: Description; skillIds: string[] }[];
    skillIds: string[];
    contactIds: string[];
}

export interface EducationExperience
    extends Omit<WorkExperience, "organization"> {
    organization: Organization;
    education: Education;
}

export interface ResumeData {
    subject: Contact;
    summary?: Description[]; // get this as a contact description
    workExperiences?: WorkExperience[]; // experiences where type is work or internship
    educationExperiences?: EducationExperience[]; // experiences where type is project
    skills?: Skill[];
    contacts?: Contact[];
}
