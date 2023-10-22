import axios from "axios";

const baseUrl = "https://api.carlmoore.xyz:8080";

export interface Description {
    id: string;
    kmeansLabel: number;
    reducedEmbedding: number[];
    text: string;
}

export interface Experience {
    id: string;
    name: string;
    contactId: string;
    contacts: any[];
    descriptions: Description[];
    startDate: string | null;
    endDate?: string | null;
    organization: {
        name: string;
        location: string;
    };
}

export const getExperiences = async () : Promise<Experience[]> => {
    const response = await axios.get(`${baseUrl}/resume/descriptions`);
    return response.data;
};
