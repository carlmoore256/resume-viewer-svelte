<script lang="ts">
    import DescriptionMap from "../components/DescriptionMap.svelte";
    import ExperienceCreator from "../components/ExperienceCreator.svelte";
    import SkillList from "../components/SkillList.svelte";
    import { experienceStore } from "../lib/stores/experienceStore";
    import { skillStore } from "../lib/stores/skillStore";

    let width = window.innerWidth;
    let height = window.innerHeight;
</script>

<svelte:window
    on:resize={() => {
        width = window.innerWidth;
        height = window.innerHeight;
    }}
/>

<main>
    <DescriptionMap
        width={window.innerWidth}
        height={window.innerHeight}
        experiences={$experienceStore}
        options={{
            descriptionPointOptions: {
                nodeSize: 8,
                hoverSizeMult: 1.1,
                hoverSizeDurationMs: 300,
                tooltipTransitionMs: 100,
                tooltipOpacity: 0.3,
            },
            experiencePointOptions: {
                nodeSize: 0.5,
                hoverSizeMult: 1.3,
                hoverSizeDecayMs: 800,
                opacity: 0.1,
            },
            descriptionTooltipOptions: {
                opacity: 0.3,
                offsetX: 15,
                offsetY: 15,
                anchorSize: 23,
            },
            margin: { top: 100, right: 100, bottom: 100, left: 100 },
        }}
    />
    <ExperienceCreator />
    <SkillList skills={$skillStore} />
</main>

<style>
    main {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        font-size: 12px;
    }
</style>
