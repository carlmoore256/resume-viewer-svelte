<script lang="ts">
    import { slide } from "svelte/transition";
    export let title: string = ""; // Allows for an optional title for the section
    export let titleStyle: string =
        "px-5 bg-neutral-700 bg-opacity-50 backdrop-blur-sm rounded-t-md";

    let isExpanded: boolean = true;
</script>

<div class="mb-2 mt-2">
    {#if title}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <h2 class="section-title sticky top-0 font-medium p-2 select-none cursor-pointer {titleStyle}" on:click={() => isExpanded = !isExpanded}>
            {title}
        </h2>
    {/if}

    {#if isExpanded}
        <div class="py-3 bg-neutral-800" in:slide={{duration: 300}} out:slide={{duration: 300}}>
            <slot />
            <!-- This is where the content of the section will be inserted -->
        </div>
    {/if}
</div>

<style>
    .section-title {
        /* background-color: #1b1b1b; */
        border-bottom: 1px solid #cccccc5e;
        /* padding: 6px 0 6px 20px; */
    }
</style>
