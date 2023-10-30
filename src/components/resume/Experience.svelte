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
    <div class="position">
        <h3>{experience.name}</h3>
    </div>
    <div class="horizontal-bar">
        <div class="position">
            <span
                ><strong>{experience.organization.name}</strong> | {experience
                    .organization.location}</span
            >
        </div>
        <div class="date">
            {readableDate(experience.startDate || "")}

            {#if experience.endDate}
                - {readableDate(experience.endDate || "")}
            {:else}
                - Present
            {/if}
        </div>
    </div>

    <!-- {#if showingDetails} -->
    <div class="details" style={detailsStyle}>
        {#if experience.descriptions.length > 0}
            <ul
                class="list-disc marker:text-stone-50 text-stone-300 ml-5 mt-1 text-sm"
                transition:scale={{ start: 0.95, duration: 200 }}
            >
                {#each experience.descriptions as description, index}
                    <li
                        class="bullet-container"
                        id={`bullet_${description.id}`}
                    >
                        {description.text}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>

<style>
    .horizontal-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .position h3 {
        margin: 0;
        font-weight: bold;
        color: #ffffff;
        font-size: larger;
    }

    .position span {
        font-size: 0.9em;
        color: #b7b7b7;
    }

    .date {
        font-size: 0.85em;
        color: #b7b7b7;
        margin-top: 5px;
    }

    .highlights {
        margin-top: 10px;
        list-style-type: disc;
    }

    .highlights li {
        margin-bottom: 5px;
        text-indent: 6x;
        margin-left: 15px;
    }
</style>
