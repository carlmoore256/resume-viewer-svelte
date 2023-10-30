<script lang="ts">
    import Resume from "../components/resume/Resume.svelte";
    import type { ResumeData } from "../lib/resume-types";

    let resumeData: ResumeData;
    let isLoading = true;

    import("../data/resume-carl-moore.json").then((data) => {
        resumeData = data as ResumeData;
        isLoading = false;
    });
</script>

{#if resumeData}
    <Resume {resumeData} />
{/if}
