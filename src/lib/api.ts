import axios from 'axios';

const baseUrl = "https://api.carlmoore.xyz:8080";

export const getDescriptions = async () => {
    const response = await axios.get(`${baseUrl}/resume/descriptions`);
    return response.data;
}