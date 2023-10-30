<script lang="ts">
    import * as d3 from "d3";
    import type { ResumeDataset } from "../lib/ResumeDataset";
    import type { Experience } from "../lib/api";
    import type { ExperiencePointOptions } from "../lib/chart-types";

    export let experience: Experience;
    export let dataset: ResumeDataset;
    export let options: ExperiencePointOptions;

    export let onMouseover:
        | ((event: MouseEvent, data: Experience) => void)
        | null = null;
    export let onMouseout:
        | ((event: MouseEvent, data: Experience) => void)
        | null = null;
    export let onClick: ((event: MouseEvent, data: Experience) => void) | null =
        null;

    function handleMouseover(event: MouseEvent) {
        if (onMouseover) {
            onMouseover(event, experience);
        }
    }

    function handleMouseout(event: MouseEvent) {
        if (onMouseout) {
            onMouseout(event, experience);
        }
        d3.select(event.target as SVGElement)
            .transition()
            .duration(options.hoverSizeDecayMs)
            .attr("r", radius * options.nodeSize);
    }

    function handleClick(event: MouseEvent) {
        if (onClick) {
            onClick(event, experience);
        }
        d3.select(event.target as SVGElement)
            .transition()
            .duration(100)
            .attr("r", radius * options.nodeSize * options.hoverSizeMult);
    }

    $: position = dataset.experiencePosition(experience);
    $: radius = dataset.experienceRadius(experience);
    $: color = dataset.experienceColor(experience);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<circle
    data-interactive
    class="experience"
    cx={position.x || 0}
    cy={position.y || 0}
    fill={color}
    r={radius * options.nodeSize}
    opacity={options.opacity}
    on:mouseover={handleMouseover}
    on:mouseout={handleMouseout}
    on:click={handleClick}
    style="transition-duration: {options.transitionMs}ms;"
/>
