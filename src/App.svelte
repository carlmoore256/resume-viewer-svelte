<script lang="ts">
    import Resume from "./components/resume/Resume.svelte";
    import type { ResumeData } from "./lib/resume-types";
    import { isMapShowing } from "./lib/stores/applicationStateStores";

    import { onMount } from "svelte";
    import DescriptionMapPage from "./pages/DescriptionMapPage.svelte";

    let resumeData: ResumeData;

    $: {
        console.log("isMapShowing", $isMapShowing);
    }

    onMount(() => {
        import("./data/resume-carl-moore.json").then((data) => {
            resumeData = data as ResumeData;
            console.log("loaded resume data", resumeData);
        });
    });
</script>

<div>
    {#if !resumeData}
        <p>Loading...</p>
    {:else if !$isMapShowing}
        <Resume
            contactEmail={import.meta.env.VITE_MY_CONTACT_EMAIL}
            {resumeData}
        />
    {:else}
        <DescriptionMapPage
            width={window.innerWidth}
            height={window.innerHeight}
        />
    {/if}

    <!-- <button id="use-map" on:click={() => (showingMap = !showingMap)}>
            {#if showingMap}
                Hide Map
            {:else}
                Show Map
            {/if}
        </button>
        {#if useNodes}
            <DescriptionMapOverlay isActivated={showingMap} />
            <Resume {resumeData} />
        {:else}
            <Resume {resumeData} />
        {/if} -->
</div>
