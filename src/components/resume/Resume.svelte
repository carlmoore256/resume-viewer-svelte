<script lang="ts">
    import { onMount } from "svelte";
    import type { ResumeData } from "../../lib/resume-types";
    import SubjectHeader from "../SubjectHeader.svelte";
    import Summary from "./Summary.svelte";
    import Experience from "./Experience.svelte";
    import Education from "./Education.svelte";
    import Section from "../Section.svelte";
    import type { Experience as ExperienceType } from "../../lib/api";
    // import { experienceDataStore } from "../lib/stores/experienceElementStore";
    import { experienceStore } from "../../lib/stores/experienceStore";
    import { getExperiences } from "../../lib/api";
    import { skillStore } from "../../lib/stores/skillStore";
    import { currentContactStore } from "../../lib/stores/currentContactStore";
    import SkillSection from "../sections/SkillSection.svelte";
    
    export let resumeData : ResumeData;

    let experiences : ExperienceType[] = [];

    // onMount(() => {
    //     getExperiences().then((data) => {

    //         // sort experiences by date
    //         experiences = data.sort((a, b) => {
    //             if (a.startDate && b.startDate) {
    //                 return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    //             } else {
    //                 return 0;
    //             }
    //         });
    //     });
    // });

    // ai integration ideas
    // - use ai to generate a resume based on a job description
    // - categorize skills
    // - create skill descriptions
    // - automatically generate a cover letter

    $: {
        if ($currentContactStore) {
            skillStore.fetchData($currentContactStore.id);
        }
    }

    $: if ($experienceStore.length > 0) {
        console.log("YOOO LOADED EXPERIENCES");
    }

</script>


<div class="justify-center w-full px-4 text-stone-100">
    <!-- NEVER set the height of a parent explicitly -->
    <div class="max-w-screen-lg  mx-auto">
        <SubjectHeader subject={$currentContactStore}/>
        <Section title="Summary">
            <Summary summary={resumeData.summary}/>
        </Section>
        
        <Section title="Education">
            {#each resumeData.education as education}
                <Education education={education}/>
            {/each}
        </Section>

        <Section title="Experience">
            {#if $experienceStore.length === 0}
                <p>Loading...</p>
            {:else}
                {#each $experienceStore as experience}
                    <Experience {experience}/>
                {/each}
            {/if}
        </Section>


        <Section title="Skills">
            <SkillSection />

        </Section>
    </div>
</div>

<style>
</style>