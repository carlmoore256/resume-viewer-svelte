<script lang="ts">
    export let title: string = "";
    export let listItems: string[];
</script>

<div class="flex flex-col w-1/2">
    <div class="bg-neutral-900 rounded-t-md px-4 py-1 border border-neutral-700">
        <h3 class="font-light">{title}</h3>
    </div>
    <div
        class="flex-grow px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-b-md text-sm"
    >
        <ul class="pl-5 list-disc font-light">
            {#each listItems as item}
                <li>{item}</li>
            {/each}
        </ul>
    </div>
</div>
