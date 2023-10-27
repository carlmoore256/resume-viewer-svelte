<script lang="ts">
    import DescriptionMap from "../components/DescriptionMap.svelte";
    import ExperienceCreator from "../components/ExperienceCreator.svelte";
    import SkillList from "../components/SkillList.svelte";
    import { experienceStore } from "../lib/stores/experienceStore";
    import { skillStore } from "../lib/stores/skillStore";

    let width = window.innerWidth;
    let height = window.innerHeight;

    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;
    }
</script>

<svelte:window on:resize={handleResize} />

<main>
    <button
        id="randomize"
        on:click={() => experienceStore.randomizePositions(0.1)}
    >
        Randomize
    </button>
    <DescriptionMap
        {width}
        {height}
        experiences={$experienceStore}
        options={{
            descriptionPointOptions: {
                nodeSize: 8,
                hoverSizeMult: 1.1,
                hoverSizeDurationMs: 300,
                tooltipTransitionMs: 100,
                tooltipOpacity: 0.3,
                transitionMs: 800,
            },
            experiencePointOptions: {
                nodeSize: 0.5,
                hoverSizeMult: 1.3,
                hoverSizeDecayMs: 800,
                opacity: 0.1,
                transitionMs: 800,
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
    #randomize {
        border: 1px solid black;
        border-radius: 5px;
        padding: 5px;
        font-size: 12px;
        cursor: pointer;
        position:absolute;
        top: 10px;
        right: 10px;
        z-index: 100;
    }

    #randomize:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    main {
        margin: 0;
        padding: 0;
        font-family: sans-serif;
        font-size: 12px;
    }
</style>
