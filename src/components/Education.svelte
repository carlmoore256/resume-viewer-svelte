<script lang="ts">
    import type { _Education } from "../lib/resume-types";
    import ListBox from "./ListBox.svelte";

    export let education: _Education;
    export let courseDescription: string = "Notable courses:";
    export let activitiesDescription: string = "Activities:";
</script>

<div class="education-section">
    <div class="degree-info">
        <h3>{education.degree} ({education.degreeType})</h3>
    </div>

    <div class="horizontal-bar">
        <span class="institution"><strong>{education.institution}</strong> | {education.location}</span>
        <span class="date-range">{education.date.start} - {education.date.end || "Present"}</span>
    </div>

    {#if education.summary}
        <div class="summary">
            {education.summary}
        </div>
    {/if}

    <div class="list-boxes">
        {#if education.courses && education.courses.length > 0}
            <ListBox title={courseDescription} listItems={education.courses} />
        {/if}

        {#if education.activities && education.activities.length > 0}
            <ListBox title={activitiesDescription} listItems={education.activities} />
        {/if}
    </div>
</div>

<style>
    .education-section {
        margin-bottom: 20px;
        padding: 0 10px;
    }

    .horizontal-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .degree-info h3 {
        margin: 0;
        font-weight: bold;
        color: #ffffff;
        font-size: larger;
    }

    .institution {
        margin-top: 5px;
        font-size: 0.9em;
        color: #b7b7b7;
    }

    .date-range {
        margin-top: 5px;
        font-size: 0.85em;
        color: #b7b7b7;
    }

    .summary {
        margin-top: 10px;
        font-size: 0.9em;
        color: #c8c8c8;
    }

    .list-boxes {
        padding: 20px;
        display: flex;
        gap: 20px;
    }
</style>
