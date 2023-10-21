<script lang="ts">
    import type { Experience } from "../lib/resume-types";
    import { fade, scale } from "svelte/transition";

    import Icon from "@iconify/svelte";
    export let experience: Experience;

    let showingDetails = true;
</script>

<div class="experience-section">
    <div class="position">
        <h3>{experience.position}</h3>
    </div>
    <div class="horizontal-bar">
        <div class="position">
            <span
                ><strong>{experience.company}</strong> | {experience.location}</span
            >
        </div>
        <div class="date">
            {experience.date.start}

            {#if experience.date.end}
                - {experience.date.end}
            {:else}
                - Present
            {/if}
        </div>
    </div>
    <!-- {#if experience.summary}
        <div class="summary">
            {experience.summary}
        </div>
    {/if} -->
    <!-- {#if experience.summary && !showingDetails}
        <div class="summary">
            {experience.summary}
        </div>
    {/if} -->
<!-- 
    {#if experience.highlights && experience.highlights.length > 0 && !showingDetails}
        <button
            class="expand-button"
            on:click={() => (showingDetails = !showingDetails)}
            in:fade={{ duration: 200 }}
        >
            <Icon icon="ooui:expand" />
        </button>
    {/if} -->

    {#if showingDetails}
        {#if experience.highlights && experience.highlights.length > 0}
            <ul
                class="highlights"
                transition:scale={{ start: 0.95, duration: 200 }}
            >
                {#each experience.highlights as highlight}
                    <li>{highlight}</li>
                {/each}
            </ul>
        {/if}
    {/if}
</div>

<style>
    .horizontal-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .expand-button {
        border-radius: 8px;
        max-width: 200px;
        visibility: hidden;
        opacity: 0;
        background-color: transparent;
        border: none;
        color: #ffffff47;
        font-size: 0.9em;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s ease;
    }

    .expand-button:hover {
        background-color: rgba(135, 46, 146, 0.345);
        transform: scale(1.05); /* Slight zoom effect */
    }

    .experience-section {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        padding: 0 10px;
    }

    .experience-section:hover .expand-button {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
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

    .summary {
        margin-top: 10px;
        font-size: 0.9em;
        color: #b7b7b7;
    }

    .highlights {
        margin-top: 10px;
        list-style-type: disc;
    }

    .highlights li {
        margin-bottom: 5px;
        text-indent: 6x;
        margin-left: -10px;
    }
</style>
