<script lang="ts">
    import Resume from "./components/resume/Resume.svelte";
    import { isMapShowing } from "./lib/stores/applicationStateStores";

    import { onMount } from "svelte";
    import Notifications from "./components/notifications/Notifications.svelte";
    import DescriptionMapPage from "./pages/DescriptionMapPage.svelte";

    import {
        descriptionStore,
        organizationStore,
        resumeDataStore,
    } from "./lib/stores/resumeDataStore";

    onMount(async () => {
        resumeDataStore.fetch("carlmoore256@gmail.com");
    });

    $: console.log($resumeDataStore);
</script>

<Notifications />

<div>
    {#if !$resumeDataStore}
        <p>Loading...</p>
    {:else if !$isMapShowing}
        <Resume resumeData={$resumeDataStore} />
    {:else}
        <DescriptionMapPage
            width={window.innerWidth}
            height={window.innerHeight}
        />
    {/if}
</div>
