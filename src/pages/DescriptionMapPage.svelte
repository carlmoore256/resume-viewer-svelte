<script lang="ts">
    import DescriptionMap from "../components/DescriptionMap.svelte";
    import ExperienceCreator from "../components/ExperienceCreator.svelte";
    import SkillList from "../components/SkillList.svelte";
    import { experienceStore } from "../lib/stores/experienceStore";
    import { skillStore } from "../lib/stores/skillStore";

    let width = window.innerWidth;
    let height = window.innerHeight;



</script>

<svelte:window on:resize={() => {
    width = window.innerWidth;
    height = window.innerHeight;
}} />

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
