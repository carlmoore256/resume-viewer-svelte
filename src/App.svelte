<script lang="ts">
    import Resume from "./components/Resume.svelte";
    import type { ResumeData } from "./lib/resume-types";
    import DescriptionMapOverlay from "./components/DescriptionMapOverlay.svelte";
    import DescriptionMap from "./components/DescriptionMap.svelte";
    import Basic from "./components/Basic.svelte";
    import ExperienceCreator from "./components/ExperienceCreator.svelte";

    let resumeData: ResumeData;
    let isLoading = true;

    import("./data/resume-carl-moore.json").then((data) => {
        resumeData = data as ResumeData;
        isLoading = false;
    });

    let useNodes = true;
    let useMap = false;

    type Page = "resume" | "map" | "resume-map";

    const currentPage: Page = "map";
</script>

<div class="container">
    {#if isLoading}
        <p>Loading...</p>
    {:else}
        {#if currentPage == "map"}
            <DescriptionMap />
            <ExperienceCreator />
        {:else if currentPage == "resume"}
            <Resume {resumeData} />
        {:else if currentPage == "resume-map"}
            <button id="use-map" on:click={() => (useMap = !useMap)}>
                {#if useMap}
                    Hide Map
                {:else}
                    Show Map
                {/if}
            </button>
            {#if useNodes}
                <DescriptionMapOverlay isActivated={useMap} />
                <Resume {resumeData} />
            {:else}
                <Resume {resumeData} />
            {/if}
        {/if}
        <main />
    {/if}
</div>

<style>
    #use-map {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 100;
    }

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
