<script lang="ts">
    import { onMount } from "svelte";
    import type { ResumeData } from "../lib/resume-types";
    import SubjectHeader from "./SubjectHeader.svelte";
    import Summary from "./Summary.svelte";
    import Experience from "./Experience.svelte";
    import Education from "./Education.svelte";
    import Section from "./Section.svelte";
    import type { Experience as ExperienceType } from "../lib/api";
    // import { experienceDataStore } from "../lib/stores/experienceElementStore";
    import { experienceStore } from "../lib/stores/experienceStore";
    import { getExperiences } from "../lib/api";
    
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

    $: if ($experienceStore.length > 0) {
        console.log("YOOO LOADED EXPERIENCES");
    }

</script>


<div>
    <SubjectHeader subject={resumeData.subject}/>
    <div class="content">
        <Section title="Summary">
            <Summary summary={resumeData.summary}/>
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

        <Section title="Education">
            {#each resumeData.education as education}
                <Education education={education}/>
            {/each}
        </Section>

    </div>
</div>

<style>
    .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        /* padding: 5px 20px; */
    }
</style>