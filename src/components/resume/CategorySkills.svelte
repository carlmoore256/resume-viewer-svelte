<script lang="ts">
    import type { CategorySkills } from "../../lib/derived-types";

    export let data: CategorySkills;
</script>

<div class=" p-2 bg-neutral-900 rounded-md">
    <h3>
        {data.category}

        <div class="flex flex-row h-10">
            {#each data.skills as skill}
                <div class="text-xs bg-gray-500 px-2 py-1 ml-2">
                    {skill.name}
                </div>
            {/each}
        </div>
    </h3>
</div>
