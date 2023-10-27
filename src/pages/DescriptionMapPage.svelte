<script lang="ts">
    import DescriptionMap from "../components/DescriptionMap.svelte";
    import ExperienceCreator from "../components/ExperienceCreator.svelte";
    import SkillList from "../components/SkillList.svelte";
    import { experienceStore } from "../lib/stores/experienceStore";
    import { skillStore } from "../lib/stores/skillStore";
</script>

<main>
    <DescriptionMap
        width={window.innerWidth}
        height={window.innerHeight}
        experiences={$experienceStore}
    />
    <ExperienceCreator />
    <SkillList skillIds={$skillStore.map((s) => s.id)} />
</main>

<style>
    main {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        font-size: 12px;
    }
</style>
