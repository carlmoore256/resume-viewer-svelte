<script lang="ts">
    import { styleToString } from "../../lib/format";
    import type { TooltipContent } from "../../lib/chart-types";
    import { fade } from "svelte/transition"; // Import slide transition

    export let title: string | null = null;
    export let subtitle: string | null = null;
    export let style: any | null = null;

    $: style = style ? styleToString(style) : "";
</script>

<div
    class="container"
    transition:fade={{ duration: 200 }}
>
    <div class="tooltip" {style}>
        {#if title}
            <h3>{title}</h3>
        {/if}

        {#if subtitle}
            <p>{subtitle}</p>
        {/if}

        <slot />
    </div>
</div>

<style>
    .tooltip {
        /* position: absolute; */
        background-color: rgba(71, 26, 72, 0.785);
        /* border: 1px solid black; */
        /* pointer-events: none; */
        transition: opacity 0.3s;
        filter: drop-shadow(0px 0px 3px rgba(66, 46, 46, 0.209));
        border-radius: 5px;
        padding: 5px;
        /* min-width: 200px;
        max-width: 400px; */

        font-family: sans-serif;
        backdrop-filter: blur(10px);
    }
    .container {
        z-index: 100;
    }

    .container.show {
        opacity: 1;
    }

    p {
        margin: 2px;
        font-size: 12px;
    }

    h3 {
        margin: 2px;
        font-size: 12px;
    }

    .tooltip.show {
        opacity: 1;
    }
</style>
