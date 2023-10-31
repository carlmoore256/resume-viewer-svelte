<script lang="ts">
    import { scale } from "svelte/transition";
    import type { WorkExperience } from "../../lib/api-types";
    import { readableDate } from "../../lib/format";

    export let workExperience: WorkExperience;

    const { experience, organization, descriptions } = workExperience;

    let showingDetails = true;
    let detailsStyle = "";

    // idea - have a button that re-words everything using openai
</script>

<div class="flex flex-col px-4 pb-4">
    <div class="text-white font-bold text-lg">
        <h3>{experience.name}</h3>
    </div>
    <div class="flex justify-between items-center">
        <div class="text-gray-400 text-sm">
            <span
                ><strong>{organization?.name}</strong> | {organization?.location}</span
            >
        </div>
        <div class="text-gray-400 text-xs mt-1">
            {readableDate(experience.startDate || "")}
            {#if experience.endDate}
                - {readableDate(experience.endDate || "")}
            {:else}
                - Present
            {/if}
        </div>
    </div>

    <!-- {#if showingDetails} -->
    <div class="mt-2.5 text-gray-300 text-sm" style={detailsStyle}>
        {#if descriptions.length > 0}
            <ul
                class="list-disc list-inside mt-1 text-sm"
                transition:scale={{ start: 0.95, duration: 200 }}
            >
                {#each descriptions as description, index}
                    <li id={`bullet_${description.description.id}`}>
                        {description.description.text}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
