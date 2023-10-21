<script lang="ts">

    import type { ResumeData } from "../lib/resume-types";
    import SubjectHeader from "./SubjectHeader.svelte";
    import Summary from "./Summary.svelte";
    import Experience from "./Experience.svelte";
    import Education from "./Education.svelte";
    import Section from "./Section.svelte";

    export let resumeData : ResumeData;
</script>


<div>
    <SubjectHeader subject={resumeData.subject}/>
    <div class="content">
        <Section title="Summary">
            <Summary summary={resumeData.summary}/>
        </Section>

        <Section title="Experience">
            {#each resumeData.experiences as experience}
                <Experience experience={experience}/>
            {/each}
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