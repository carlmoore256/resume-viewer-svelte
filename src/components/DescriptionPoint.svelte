<script lang="ts">
    import type { DescriptionPoint } from "../lib/chart-types";
    export let data: DescriptionPoint;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<circle
    class="description"
    cx={xScale(data.x)}
    cy={yScale(data.y)}
    fill={colorScale(data.experience.name)}
    r={options.nodeSize}
    opacity={1}
    on:mouseover={(event) => handleDescriptionMouseover(event, data)}
    on:mouseleave={(event) => handleDescriptionMouseout(event, data)}
    on:click={(event) => handleDescriptionClick(event, data)}
/>