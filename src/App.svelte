<script lang="ts">
    import Resume from "./components/Resume.svelte";
    import type { ResumeData } from "./lib/resume-types";
    import DescriptionMapOverlay from "./components/DescriptionMapOverlay.svelte";

    import DescriptionMapPage from "./pages/DescriptionMapPage.svelte";

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

<!-- <Navbar /> -->
<div class="container">
    {#if isLoading}
        <p>Loading...</p>
    {:else if currentPage == "map"}
        <DescriptionMapPage />
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
        justify-content: left;
    }
</style>
