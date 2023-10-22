<script lang="ts">
    import Resume from "./components/Resume.svelte";
    import type { ResumeData } from "./lib/resume-types";
    import DescriptionMap from "./components/DescriptionMap.svelte";
    import Basic from "./components/Basic.svelte";

    let resumeData: ResumeData;
    let isLoading = true;

    import("./data/resume-carl-moore.json").then((data) => {
        resumeData = data as ResumeData;
        isLoading = false;
    });

    let useNodes = true;
</script>

<div class="container">
    {#if isLoading}
        <p>Loading...</p>
    {:else}
        <main>
            {#if useNodes}
                <DescriptionMap />
                <Resume {resumeData} />
            {:else}
                <Resume {resumeData} />
            {/if}
        </main>
    {/if}
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        min-height: 100vh; /* for vertical centering */
        /* z-index: 10; */
        /* padding: 10px; */
    }

    main {
        max-width: 1000px;
        width: 100%; /* ensure it takes the full width up to 600px */
    }
</style>
