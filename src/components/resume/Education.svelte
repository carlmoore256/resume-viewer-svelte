<script lang="ts">
    import { slide } from "svelte/transition";
    import type { Education, Organization, Experience, Description, ExperienceJoin } from "../../lib/api-types";


    import ListBox from "../ListBox.svelte";
    import { readableDate } from "../../lib/format";
    import {
        organizationStore,
        experienceStore,
        experienceJoinStore,
        descriptionStore,
    } from "../../lib/stores/resumeDataStore";
    export let education: Education;
    export let courseDescription: string = "Notable courses";
    export let activitiesDescription: string = "Activities";

    // we have to find the experience store where educationId = experience.id
    $: experience = $experienceStore.find(
        (e) => e.id === education.id
    ) as Experience;

    $: joins = $experienceJoinStore.find(
        (data) => data.experienceId === education.id
    ) as ExperienceJoin;

    $: descriptions = $descriptionStore.filter((d) =>
        joins.descriptionIds.includes(d.id)
    );

    $: organization = $organizationStore.find(
        (o) => o.id === experience.organizationId
    ) as Organization;

    let isExpanded = false;

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }
</script>

<div class="px-4 pb-5">
    <button
        on:click={toggleExpanded}
        class="w-full transition-all duration-300 hover:p-2 text-left rounded-md focus:outline-none hover:bg-gray-800"
    >
        <div class="text-white font-bold text-lg">
            <h3>{education.degree} ({education.degreeType})</h3>
        </div>

        <div class="flex justify-between items-center">
            <span class="text-gray-400 mt-1 text-sm">
                <strong>{organization.name}</strong> | {organization.location}
            </span>
            <span class="text-gray-400 mt-1 text-sm">
                {readableDate(experience.startDate)} - {readableDate(
                    experience.endDate || ""
                ) || "Present"}
            </span>
        </div>
    </button>

    {#if isExpanded}
        <div transition:slide={{ duration: 300 }}>
            {#each descriptions as description}
                <div class="mt-2.5 text-gray-300 text-sm">
                    {description.text}
                </div>
            {/each}

            <div
                class="pt-5 flex space-x-5 items-stretch justify-items-stretch"
            >
                {#if education.courses && education.courses.length > 0}
                    <ListBox
                        title={courseDescription}
                        listItems={education.courses}
                    />
                {/if}

                <!-- {#if education.activities && education.activities.length > 0}
                    <ListBox
                        title={activitiesDescription}
                        listItems={education.activities}
                    />
                {/if} -->
            </div>
        </div>
    {/if}
</div>
