<script lang="ts">
    import type { Description } from "../../lib/api-types";

    export let summary : Description[];
</script>

<div class="px-4 text-md">
    {#each summary as item}
        <p>{item.text}</p>
    {/each}
</div>