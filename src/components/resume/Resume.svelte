<script lang="ts">
    import type { ResumeData } from "../../lib/api-types";
    import Section from "../Section.svelte";
    import SubjectHeader from "../SubjectHeader.svelte";
    import Education from "./Education.svelte";
    import Experience from "./Experience.svelte";
    import Summary from "./Summary.svelte";
    import { getCategorySkills } from "../../lib/stores/skillStore";
    import type { CategorySkills } from "../../lib/types/derived-types";
    import SkillSection from "../sections/SkillSection.svelte";

    export let resumeData: ResumeData;

    // ai integration ideas
    // - use ai to generate a resume based on a job description
    // - categorize skills
    // - create skill descriptions
    // - automatically generate a cover letter
    // - generate descriptions of each experience

    let categorySkills: CategorySkills[] = getCategorySkills(resumeData.skills);
    let experiences = resumeData.experiences.filter((e) => e.type === "Work");
</script>

<div class="justify-center w-full px-4 text-stone-100">
    <!-- NEVER set the height of a parent explicitly -->
    <div class="max-w-screen-lg mx-auto">
        <!-- {#if $currentContactStore == null}
            <LoadingPlaceholder />
        {:else}
        {/if} -->
        <SubjectHeader subject={resumeData.subject} />

        {#if resumeData.summary != null}
            <Section title="Summary">
                <Summary summary={resumeData.summary} />
            </Section>
        {/if}

        <Section title="Experience">
            {#each experiences as experience}
                <Experience {experience} />
            {/each}
        </Section>

        {#if resumeData.educations.length > 0}
            <Section title="Education">
                {#each resumeData.educations as education}
                    <Education {education} />
                {/each}
            </Section>
        {/if}

        <Section title="Skills">
            <SkillSection {categorySkills} />
        </Section>
    </div>
</div>

<style>
</style>
