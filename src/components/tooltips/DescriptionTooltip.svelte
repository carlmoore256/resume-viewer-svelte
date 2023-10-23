<script lang="ts">
    import type { TooltipContent } from "../../lib/chart-types";
    import { slide } from "svelte/transition"; // Import slide transition

    import Tooltip from "./Tooltip.svelte";

    export let content: TooltipContent | null = null;
    export let position: { x: number; y: number };
    export let show = false;
    export let showActions = false;

    let editMode = false;
</script>

<Tooltip {content} {position} {show}>
    {#if showActions}
        <div class="container" transition:slide={{ duration: 300 }}>
            <button on:click={() => console.log("edit clicked")}>Edit</button>
            <button>Add Skill</button>
        </div>
    {/if}
</Tooltip>

<style>
    .container {
        width: inherit;
        overflow: hidden;
        height: 30px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5px;
        margin: 8px 0;
        justify-content: left;
    }

    button {
        border-radius: 10px;
        border: none;
        padding: 5px 10px;
    }
</style>
