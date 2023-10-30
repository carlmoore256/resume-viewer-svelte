<script lang="ts">
    import { slide } from "svelte/transition";

    import type { _Education } from "../../lib/resume-types";
    import ListBox from "../ListBox.svelte";

    export let education: _Education;
    export let courseDescription: string = "Notable courses";
    export let activitiesDescription: string = "Activities";

    let isExpanded = false;

    // add papers published for education
</script>

<div class="mb-5 px-4">
    <div>
        <div class="text-white font-bold text-lg">
            <h3>{education.degree} ({education.degreeType})</h3>
        </div>

        <div class="flex justify-between items-center">
            <span class="text-gray-400 mt-1 text-sm"
                ><strong>{education.institution}</strong> | {education.location}</span
            >
            <span class="text-gray-400 mt-1 text-xs"
                >{education.date.start} - {education.date.end ||
                    "Present"}</span
            >
        </div>
    </div>

    {#if isExpanded}
        {#if education.summary}
            <div class="mt-2.5 text-gray-300 text-sm">
                {education.summary}
            </div>
        {/if}

        <div class="pt-5 flex space-x-5 items-stretch justify-items-stretch">
            {#if education.courses && education.courses.length > 0}
                <ListBox
                    title={courseDescription}
                    listItems={education.courses}
                />
            {/if}

            {#if education.activities && education.activities.length > 0}
                <ListBox
                    title={activitiesDescription}
                    listItems={education.activities}
                />
            {/if}
        </div>
    {/if}
</div>
