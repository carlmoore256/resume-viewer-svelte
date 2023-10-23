<script lang="ts">
    import { styleToString } from "../../lib/format";
    import type { TooltipContent } from "../../lib/chart-types";

    export let content: TooltipContent | null = null;
    export let position: { x: number; y: number };
    export let show = false;

    $: style = content?.style ? styleToString(content?.style) : "";

    let htmlContent: string = content?.html || "";
</script>

<div
    style={`top: ${position.y}px; left: ${position.x}px;`}
    class="container {show ? 'show' : ''}"
>
    <div class="tooltip" {style}>
        {#if content}
            {#if content.title}
                <h3>{content.title}</h3>
            {/if}

            {#if content.subtitle}
                <p>{content.subtitle}</p>
            {/if}

            {#if content.html}
                <div bind:innerHTML={htmlContent} contenteditable></div>
            {/if}
        {/if}
    </div>

    <slot />
</div>

<style>
    .tooltip {
        /* position: absolute; */
        background-color: rgba(71, 26, 72, 0.785);
        /* border: 1px solid black; */
        pointer-events: none; /* Prevents the tooltip from blocking mouse events */
        transition: opacity 0.3s;
        filter: drop-shadow(0px 0px 3px rgba(66, 46, 46, 0.209));
        border-radius: 5px;
        padding: 5px;
        min-width: 200px;
        max-width: 400px;

        font-family: sans-serif;
        backdrop-filter: blur(10px);
    }
    .container {
        position: absolute;
        opacity: 0;
        z-index: 21;
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
