import { writable, get } from "svelte/store";
import type {
    ResumeData,
    Contact,
    Description,
    Experience,
    Education,
    Organization,
    Skill,
    ExperienceJoin,
    DescriptionJoin,
} from "../api-types";
import { getResumeData, updateDescription } from "../api";

const createApiDataStore = <T extends Record<string, any>>(
    fetcher: (params: any) => Promise<T>,
    updater: (id: string, updatedData: Partial<T[keyof T]>) => void
) => {
    const store = writable<T>();

    const fetch = async (params: string) => {
        const data = await fetcher(params);
        store.set(data);
    };

    const update = async (id: string, updatedData: Partial<T[keyof T]>) => {
        const currentData = get(store);
        const updatedItem = { ...currentData[id], ...updatedData };
        store.update((data) => ({ ...data, [id]: updatedItem }));

        try {
            await updater(id, updatedData);
        } catch (e) {
            console.error(e);
            // revert changes
            store.update((data) => ({ ...data, [id]: currentData[id] }));
        }
    };

    return {
        ...store,
        fetch,
        update,
    };
};

const normalizeData = <T>(data: T[], id: string) => {
    return data.reduce((acc, d) => {
        acc[id] = d;
        return acc;
    }, {} as Record<string, T>);
};

const contactStore = createApiDataStore<Record<string, Contact>>(
    async (forEmail) => {
        const resumeData = await getResumeData(forEmail);
        return normalizeData(resumeData.contacts, "id");
    },
    async (id, updatedItem) => {}
);

const descriptionStore = createApiDataStore<Record<string, Description>>(
    async (forEmail) => {
        const resumeData = await getResumeData(forEmail);
        return normalizeData(resumeData.descriptions, "id");
    },
    async (id, updatedItem) => {
        await updateDescription(id, updatedItem.text!);
    }
);

const experienceStore = createApiDataStore<Record<string, Experience>>(
    async (forEmail) => {
        const resumeData = await getResumeData(forEmail);
        return normalizeData(resumeData.experiences, "id");
    },
    async (id, updatedItem) => {}
);

const educationStore = createApiDataStore<Record<string, Education>>(
    async (forEmail) => {
        const resumeData = await getResumeData(forEmail);
        return normalizeData(resumeData.educations, "id");
    },
    async (id, updatedItem) => {}
);

const organizationStore = createApiDataStore<Record<string, Organization>>(
    async (forEmail) => {
        const resumeData = await getResumeData(forEmail); // TODO - update these to be specific endpoints
        return normalizeData(resumeData.organizations, "id");
    },
    async (id, updatedItem) => {}
);

const skillStore = createApiDataStore<Record<string, Skill>>(
    async (forEmail) => {
        const resumeData = await getResumeData(forEmail);
        return normalizeData(resumeData.skills, "id");
    },
    async (id, updatedItem) => {}
);

const experienceJoinStore = createApiDataStore<ExperienceJoin[]>(
    async (forEmail) => {
        const resumeData = await getResumeData(forEmail);
        return resumeData.joins.experiences;
    }
);

const descriptionJoinStore = createApiDataStore<DescriptionJoin[]>(
    async (forEmail) => {
        const resumeData = await getResumeData(forEmail);
        return resumeData.joins.descriptions;
    }
);

// basically the overall resume will be a series of ids where the items are joined

// TODO: create new endpoints to allow these to be fetched separately
// we will also on the server need to create a "Resume" model that has an id, which we fetch here,
// and can return all the relevant data
const createResumeDataStore = () => {
    const resumeDataStore = writable<ResumeData>();

    const setStores = (resumeData: ResumeData) => {
        contactStore.set(resumeData.contacts);
        descriptionStore.set(resumeData.descriptions);
        experienceStore.set(resumeData.experiences);
        educationStore.set(resumeData.educations);
        organizationStore.set(resumeData.organizations);
        skillStore.set(resumeData.skills);
        experienceJoinStore.set(resumeData.joins.experiences);
        descriptionJoinStore.set(resumeData.joins.descriptions);
    };

    const fetch = async (forEmail: string) => {
        const resumeData = await getResumeData(forEmail);
        resumeDataStore.set(resumeData);
    };

    resumeDataStore.subscribe((resumeData) => {
        if (resumeData) {
            setStores(resumeData);
        }
    });

    return {
        ...resumeDataStore,
        fetch,
    };
};

const resumeDataStore = createResumeDataStore();

export {
    resumeDataStore,
    contactStore,
    descriptionStore,
    experienceStore,
    educationStore,
    organizationStore,
    skillStore,
    experienceJoinStore,
    descriptionJoinStore,
};
