import axios from "axios";

const baseUrl = "https://api.carlmoore.xyz:8080";

export interface Description {
    id: string;
    kmeansLabel: number;
    reducedEmbedding: number[];
    text: string;
    skillIds: string[];
}

export interface Skill {
    id: string;
    name: string;
    startDate: string | null;
    contactId: string;
    description: string | null;
    keywords: string[];
}

export interface Experience {
    id: string;
    name: string;
    contactId: string;
    contacts: any[];
    descriptions: Description[];
    startDate: string;
    endDate?: string | null;
    organization: {
        name: string;
        location: string;
    };
    skillIds: string[];
}

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    github?: string;
    linkedin?: string;
    website?: string;
}

export const getExperiences = async (): Promise<Experience[]> => {
    const response = await axios.get(`${baseUrl}/resume/experience`, {
        params: {
            contactEmail: "carlmoore256@gmail.com",
        },
    });
    return response.data;
};

export const getContactByEmail = async (email: string): Promise<Contact> => {
    const response = await axios.get(`${baseUrl}/resume/contact/by-email`, {
        params: {
            email,
        },
    });
    return response.data;
};

export const changeDescription = async (
    id: string,
    text: string
): Promise<Description> => {
    const response = await axios.put(`${baseUrl}/resume/description/${id}`, {
        text,
    });
    return response.data;
};

export const getContactSkills = async (contactId: string): Promise<Skill[]> => {
    const response = await axios.get(`${baseUrl}/resume/skill`, {
        params: {
            contactId,
        },
    });
    return response.data;
};

export const addSkillToDescription = async (
    descriptionId: string,
    skillId: string
): Promise<Description> => {
    const response = await axios.post(
        `${baseUrl}/resume/skill/${skillId}/connect`,
        {
            descriptionId,
        }
    );
    return response.data;
};

export const removeSkillFromDescription = async (
    descriptionId: string,
    skillId: string
): Promise<Description> => {
    const response = await axios.post(
        `${baseUrl}/resume/skill/${skillId}/disconnect`,
        {
            descriptionId,
        }
    );
    return response.data;
};

export const addSkillToExperience = async (
    experienceId: string,
    skillId: string
): Promise<Experience> => {
    const response = await axios.post(
        `${baseUrl}/resume/skill/${skillId}/connect`,
        {
            experienceId,
        }
    );
    return response.data;
}

export const createSkill = async (
    name: string,
    contactId: string
): Promise<Skill> => {
    const response = await axios.post(`${baseUrl}/resume/skill`, {
        name,
        contactId,
    });
    return response.data;
}
