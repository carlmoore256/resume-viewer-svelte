<script lang="ts">
    import { skillStore, getCategorySkills } from "../../lib/stores/skillStore";
    import { currentContactStore } from "../../lib/stores/currentContactStore";
    import CategorySkillsComponent from "../resume/CategorySkills.svelte";
    import type { CategorySkills } from "../../lib/derived-types";

    let skillCategories: CategorySkills[] = [];
    skillStore.subscribe((data) => {
        skillCategories = getCategorySkills(data);
    });
</script>

<div class="grid grid-cols-4 p-4 mb-10 gap-4 content-stretch">
    {#each skillCategories as data}
        <CategorySkillsComponent {data} />

    {/each}
</div>
