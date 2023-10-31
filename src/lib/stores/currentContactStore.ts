import { writable } from "svelte/store";
import type { Contact } from "../api-types";
import { getContactByEmail } from "../api";

const createCurrentContactStore = () => {
    const { subscribe, set, update } = writable<Contact>();

    const setCurrentContact = (contact: Contact) => {
        set(contact);
    };

    const fetchData = async (forEmail: string) => {
        console.log("Fetching contact data...");
        try {
            const data = await getContactByEmail(forEmail);
            set(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // fetchData();

    return {
        subscribe,
        setCurrentContact,
        fetchData,
    };
};

export const currentContactStore = createCurrentContactStore();
