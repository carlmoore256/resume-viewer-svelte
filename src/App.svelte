<script lang="ts">
    import Resume from "./components/resume/Resume.svelte";
    // import type { _ResumeData } from "./lib/resume-types";
    import type { ResumeData } from "./lib/api-types";
    import { isMapShowing } from "./lib/stores/applicationStateStores";

    import { onMount } from "svelte";
    import DescriptionMapPage from "./pages/DescriptionMapPage.svelte";
    import Notifications from "./components/notifications/Notifications.svelte";
    import { getResumeData } from "./lib/api";

    let resumeData: ResumeData;

    $: {
        console.log("isMapShowing", $isMapShowing);
    }

    onMount(async () => {
        // import("./data/resume-data-carlmoore256.json").then((data) => {
        //     resumeData = data as ResumeData;
        //     console.log("loaded resume data", resumeData);
        // });

        resumeData = await getResumeData("carlmoore256@gmail.com");
        console.log("loaded resume data", resumeData);
    });
</script>


<Notifications/>

<div>
    {#if !resumeData}
        <p>Loading...</p>
    {:else if !$isMapShowing}
        <Resume
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
