<script lang="ts">
    import type { ResumeData } from "../../lib/resume-types";
    import Section from "../Section.svelte";
    import SubjectHeader from "../SubjectHeader.svelte";
    import Education from "./Education.svelte";
    import Experience from "./Experience.svelte";
    import Summary from "./Summary.svelte";
    import { currentContactStore } from "../../lib/stores/currentContactStore";
    import { experienceStore } from "../../lib/stores/experienceStore";
    import { skillStore } from "../../lib/stores/skillStore";
    import SkillSection from "../sections/SkillSection.svelte";
    import LoadingPlaceholder from "../utilities/LoadingPlaceholder.svelte";
    import { onMount } from "svelte";
    import { getCategorySkills } from "../../lib/stores/skillStore";
    import type { CategorySkills } from "../../lib/derived-types";
    
    export let contactEmail: string;
    export let resumeData: ResumeData;

    // ai integration ideas
    // - use ai to generate a resume based on a job description
    // - categorize skills
    // - create skill descriptions
    // - automatically generate a cover letter
    // - generate descriptions of each experience

    let categorySkills: CategorySkills[] = [];

    skillStore.subscribe((data) => {
        categorySkills = getCategorySkills(data);
    });

    onMount(async () => {
        await currentContactStore.fetchData(contactEmail);
        if ($currentContactStore) {
            await experienceStore.fetchData(contactEmail);
            await skillStore.fetchData(contactEmail);
        }
    });

    // $: {
    //     console.log("$currentContactStore", $currentContactStore);
    //     if ($currentContactStore) {
    //         skillStore.fetchData($currentContactStore.id);
    //     }
    // }
</script>

<div class="justify-center w-full px-4 text-stone-100">
    <!-- NEVER set the height of a parent explicitly -->
    <div class="max-w-screen-lg mx-auto">
        {#if $currentContactStore == null}
            <LoadingPlaceholder />
        {:else}
            <SubjectHeader subject={$currentContactStore} />
        {/if}
        <Section title="Summary">
            <Summary summary={resumeData.summary} />
        </Section>

        <Section title="Education">
            {#each resumeData.education as education}
                <Education {education} />
            {/each}
        </Section>

        <Section title="Experience">
            {#if $experienceStore.length === 0}
                <LoadingPlaceholder />
            {:else}
                {#each $experienceStore as experience}
                    <Experience {experience} />
                {/each}
            {/if}
        </Section>

        <Section title="Skills">
            <SkillSection {categorySkills} />
        </Section>
    </div>
</div>

<style>
</style>
