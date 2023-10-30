<script lang="ts">
    import type { CategorySkills } from "../../lib/derived-types";
    import CategorySkillsComponent from "../resume/CategorySkills.svelte";

    export let categorySkills: CategorySkills[];
</script>

<div class="grid grid-cols-4 p-4 mb-10 gap-4 content-stretch">
    {#each categorySkills as data}
        <CategorySkillsComponent {data} />
    {/each}
</div>
