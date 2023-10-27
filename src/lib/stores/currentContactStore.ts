import { writable } from "svelte/store";
import type { Contact } from "../api";
import { getContactByEmail } from "../api";

const createCurrentContactStore = (email: string) => {
    const { subscribe, set, update } = writable<Contact>();

    const setCurrentContact = (contact: Contact) => {
        set(contact);
    };

    const fetchData = async () => {
        console.log("Fetching contact data...");
        try {
            const data = await getContactByEmail(email);
            console.log("Contact data:", data);
            set(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();

    return {
        subscribe,
        setCurrentContact,
        fetchData,
    };
};

export const currentContactStore = createCurrentContactStore(
    import.meta.env.VITE_MY_CONTACT_EMAIL as string
);
