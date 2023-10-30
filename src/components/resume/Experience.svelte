<script lang="ts">
    import type { Experience } from "../../lib/api";
    import { fade, scale } from "svelte/transition";
    import { readableDate } from "../../lib/format";

    export let experience: Experience;
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
                ><strong>{experience.organization.name}</strong> | {experience
                    .organization.location}</span
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
        {#if experience.descriptions.length > 0}
            <ul
                class="list-disc list-inside mt-1 text-sm"
                transition:scale={{ start: 0.95, duration: 200 }}
            >
                {#each experience.descriptions as description, index}
                    <li id={`bullet_${description.id}`}>
                        {description.text}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>
