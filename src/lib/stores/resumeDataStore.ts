import { writable } from "svelte/store";
import type {
    ResumeData,
    Contact,
    Description,
    Experience,
    Education,
    Organization,
    Skill,
    ExperienceJoin,
    DescriptionJoin
} from "../api-types";
import { getResumeData } from "../api";


const createFetchableDataStore = <T>(fetcher: (forEmail: string) => Promise<T>) => {
    const store = writable<T>();
    const fetch = async (forEmail: string) => {
        const data = await fetcher(forEmail);
        store.set(data);
    };
    return {
        ...store,
        fetch
    };
};


const contactStore = createFetchableDataStore<Contact[]>(async (forEmail) => {
    const resumeData = await getResumeData(forEmail);
    return resumeData.contacts;
});

const descriptionStore = createFetchableDataStore<Description[]>(async (forEmail) => {
    const resumeData = await getResumeData(forEmail);
    return resumeData.descriptions;
});

const experienceStore = createFetchableDataStore<Experience[]>(async (forEmail) => {
    const resumeData = await getResumeData(forEmail);
    return resumeData.experiences;
});

const educationStore = createFetchableDataStore<Education[]>(async (forEmail) => {
    const resumeData = await getResumeData(forEmail);
    return resumeData.educations;
});

const organizationStore = createFetchableDataStore<Organization[]>(async (forEmail) => {
    const resumeData = await getResumeData(forEmail);
    return resumeData.organizations;
});


const skillStore = createFetchableDataStore<Skill[]>(async (forEmail) => {
    const resumeData = await getResumeData(forEmail);
    return resumeData.skills;
});

const experienceJoinStore = createFetchableDataStore<ExperienceJoin[]>(async (forEmail) => {
    const resumeData = await getResumeData(forEmail);
    return resumeData.joins.experiences;
});

const descriptionJoinStore = createFetchableDataStore<DescriptionJoin[]>(async (forEmail) => {
    const resumeData = await getResumeData(forEmail);
    return resumeData.joins.descriptions;
});

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
    }

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
}
