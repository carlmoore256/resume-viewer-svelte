import axios from "axios";
import type { Experience, Contact, Description, Skill, ResumeData } from "./api-types";

const baseUrl = "https://api.carlmoore.xyz:8080";

export const getResumeData = async (forEmail: string): Promise<ResumeData> => {
    const response = await axios.get(`${baseUrl}/resume`, {
        params: {
            email: forEmail,
        },
    });
    return response.data;
};

export const getExperiences = async (
    forEmail: string
): Promise<Experience[]> => {
    const response = await axios.get(`${baseUrl}/resume/experience`, {
        params: {
            contactEmail: forEmail,
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

export const getContactSkills = async (email: string): Promise<Skill[]> => {
    const response = await axios.get(`${baseUrl}/resume/skill`, {
        params: {
            email,
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
};

export const createSkill = async (
    name: string,
    contactId: string
): Promise<Skill> => {
    const response = await axios.post(`${baseUrl}/resume/skill`, {
        name,
        contactId,
    });
    return response.data;
};

export const updateDescription = async (
    id: string,
    text: string
): Promise<{ status: string }> => {
    const response = await axios.put(`${baseUrl}/resume/description/${id}`, {
        text,
    });
    return response.data;
};

export const login = async (
    username: string,
    password: string
): Promise<{ status: "success"; contact: Contact }> => {
    const response = await axios.post(`${baseUrl}/user/login`, {
        username,
        password,
    });
    if (response.data.status !== "success") {
        throw new Error("Login failed");
    }
    return response.data;
};
