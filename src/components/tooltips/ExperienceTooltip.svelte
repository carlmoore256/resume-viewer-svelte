<script lang="ts">
    import { fade } from "svelte/transition";
    import type { ResumeDataset } from "../../lib/ResumeDataset";
    import type { Experience } from "../../lib/api";
    import type {
        ExperienceTooltipOptions,
        TooltipState,
    } from "../../lib/types/chart-types";
    import { hexToRgb, rgbColorToHex } from "../../lib/colors";

    export let options: ExperienceTooltipOptions;
    export let state: TooltipState;
    export let experience: Experience;
    export let dataset: ResumeDataset;

    function getColor(opacity: number) {
        const rgb = hexToRgb(dataset.experienceColor(experience)) as any;
        return rgbColorToHex({ ...rgb, a: opacity });
    }

    $: position = dataset.experiencePosition(experience);
    $: radius = dataset.experienceRadius(experience);
    $: color = dataset.experienceColor(experience);
</script>

{#if state.showLabel}
    <div
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 300 }}
        id="label"
        style={`top: ${position.y - radius / 2}px; left: ${
            position.x - radius / 2
        }px; width: ${radius}px; height: ${radius}px;`}
    >
        <p>{experience.name}</p>
    </div>
{/if}

<style>
    #label {
        position: absolute;
        z-index: 50;
        display: flex;
        pointer-events: none;
        align-items: center;
        justify-content: center;
    }

    #label p {
        font-size: 12px;
        margin: 0;
    }

    #loading {
        position: absolute;
        top: 0;
        right: 0;
        padding: 6px;
    }

    #submit-text {
        z-index: 999;
    }

    #description-input {
        background-color: rgba(255, 255, 255, 0.5);
        color: black;
        border: none;
        border-radius: 5px;
        padding: 5px;
        margin: 5px;
        height: 100px;
    }

    #add-btn {
        border-radius: 50%;
        padding: 5px;
        margin: 5px;
        width: 30px;
        height: 30px;
        border: none;
        background-color: rgba(68, 131, 68, 0.507);
        transition-duration: 300ms;
        font-size: 14px;
    }

    #add-btn:hover {
        background-color: rgba(68, 131, 68, 0.8);
    }

    .actions {
        position: relative;
        height: 30px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5px;
        margin: 8px 0;
        justify-content: left;
    }

    .container {
        position: absolute;
        z-index: 100;
        max-width: 200px;
    }
    p {
        font-size: 12px;
    }
</style>
