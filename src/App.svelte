<script lang="ts">
    import Resume from "./components/resume/Resume.svelte";
    // import type { _ResumeData } from "./lib/resume-types";
    import type { ResumeData } from "./lib/api-types";
    import { isMapShowing } from "./lib/stores/applicationStateStores";

    import { onMount } from "svelte";
    import DescriptionMapPage from "./pages/DescriptionMapPage.svelte";
    import Notifications from "./components/notifications/Notifications.svelte";
    import { getResumeData } from "./lib/api";

    import { skillStore } from "./lib/stores/skillStore";
    import { experienceStore } from "./lib/stores/experienceStore";
    import { currentContactStore } from "./lib/stores/currentContactStore";
    import { resumeDataStore, descriptionStore, organizationStore } from "./lib/stores/resumeDataStore";

    // let resumeData: ResumeData;

    // $: {
    //     console.log("isMapShowing", $isMapShowing);
    // }

    onMount(async () => {
        // import("./data/resume-data-carlmoore256.json").then((data) => {
        //     resumeData = data as ResumeData;
        //     console.log("loaded resume data", resumeData);
        // });

        resumeDataStore.fetch("carlmoore256@gmail.com");

        // resumeData = await getResumeData("carlmoore256@gmail.com");
        // console.log("loaded resume data", resumeData);

        // skillStore.set(resumeData.skills);
        // experienceStore.set(resumeData.experiences)
        // now set the stores
    });


    $: console.log($resumeDataStore);

    $: console.log("descriptionStore store", $descriptionStore);
    $: console.log("organization store", $organizationStore);
</script>


<Notifications/>

<div>
    {#if !$resumeDataStore}
        <p>Loading...</p>
    {:else if !$isMapShowing}
        <Resume
            resumeData={$resumeDataStore}
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
