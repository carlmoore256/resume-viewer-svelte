<script lang="ts">
    export let title: string = ''; // Allows for an optional title for the section
</script>

<div class="section">
    {#if title}
        <h2 class="section-title">{title}</h2>
    {/if}
    <slot></slot> <!-- This is where the content of the section will be inserted -->
</div>

<style>
    .section {
        /* padding-bottom: 20px; */
        margin-bottom: 10px;
    }

    .section-title {
        font-weight: 700;
        position: sticky;
        top: 0; /* This means the title will stick to the top of the viewport */
        background-color: #1b1b1b;
        z-index: 10; /* Ensure the title is above other content */
        border-bottom: 1px solid #cccccc5e;
        padding: 6px 0 6px 20px;
    }
</style>