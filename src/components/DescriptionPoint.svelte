<script lang="ts">
    import * as d3 from "d3";
    import type { ResumeDataset } from "../lib/ResumeDataset";
    import type { Description } from "../lib/api";
    import type { DescriptionPointOptions } from "../lib/chart-types";
    import { fly } from "svelte/transition";

    export let description: Description;
    export let dataset: ResumeDataset;
    export let options: DescriptionPointOptions;
    export let onMouseover: ((event: MouseEvent, data: Description) => void) | null = null;
    export let onMouseout: ((event: MouseEvent, data: Description) => void) | null = null;
    export let onClick: ((event: MouseEvent, data: Description) => void) | null = null;

    function handleMouseover(event: MouseEvent) {
        if (onMouseover) {
            onMouseover(event, description);
        }
        d3.select(event.target as SVGElement)
            .transition()
            .duration(100)
            .attr("r", options.nodeSize * options.hoverSizeMult);
    }

    function handleMouseleave(event: MouseEvent) {
        if (onMouseout) {
            onMouseout(event, description);
        }
        d3.select(event.target as SVGElement)
            .transition()
            .duration(options.hoverSizeDurationMs)
            .attr("r", options.nodeSize);
    }

    function handleClick(event: MouseEvent) {
        if (onClick) {
            onClick(event, description);
        }
    }

    


    $: color = dataset.descriptionColor(description);
    $: position = dataset.descriptionPosition(description);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<circle
    data-interactive
    cx={position.x}
    cy={position.y}
    fill={color}
    r={options.nodeSize}
    opacity={1}
    on:mouseover={handleMouseover}
    on:mouseleave={handleMouseleave}
    on:click={handleClick}
    style="transition-duration: {options.transitionMs}ms;"
/>
