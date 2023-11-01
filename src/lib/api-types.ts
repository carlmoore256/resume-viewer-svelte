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


export interface ExperienceJoin {
    experienceId: string;
    organizationId: string | null;
    descriptionIds: string[];
    skillIds: string[];
    contactIds: string[];
}

export interface DescriptionJoin {
    descriptionId: string;
    skillIds: string[];
}

export interface ResumeData {
    subject: Contact;
    summary: Description[]; // get this as a contact description
    experiences: Experience[]; // experiences where type is work or internship\
    descriptions: Description[];
    educations: Education[];
    organizations: Organization[];
    skills: Skill[];
    contacts: Contact[];
    joins: {
        experiences: ExperienceJoin[];
        descriptions: DescriptionJoin[];
    };
}



// export interface ResumeExperience {
//     experience: Experience;
//     organization: Organization | null;
//     descriptions: { description: Description; skillIds: string[] }[];
//     skillIds: string[];
//     contactIds: string[];
// }

// export interface EducationExperience
//     extends Omit<ResumeExperience, "organization"> {
//     organization: Organization;
//     education: Education;
// }

// export interface ResumeData {
//     subject: Contact;
//     summary?: Description[]; // get this as a contact description
//     experiences?: ResumeExperience[];
//     skills?: Skill[];
//     contacts?: Contact[];
// }
