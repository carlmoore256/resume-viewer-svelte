<script lang="ts">
    import type { CategorySkills } from "../../lib/types/derived-types";

    export let data: CategorySkills;
</script>

<div class="p-4 bg-neutral-900 rounded-md drop-shadow-sm">
    <h3 class="text-white font-bold mb-2">{data.category}</h3>

    <div class="flex flex-wrap -m-1 skills-container overflow-y-auto max-h-24">
        {#each data.skills as skill}
            <span
                class="m-1 text-xs bg-gray-500 text-neutral-900 px-3 py-1 rounded-full "
                >{skill.name}</span
            >
        {/each}
    </div>
</div>

<style>
    /* Styles for the custom scrollbar */
    .skills-container::-webkit-scrollbar {
        width: 8px;
    }

    .skills-container::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
    }

    .skills-container::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.1);
    }
</style>
