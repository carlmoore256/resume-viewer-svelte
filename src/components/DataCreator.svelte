<script lang="ts">
</script>

<div id="container">
    <slot />
</div>

<style>
    * {
        z-index: 999;
    }

    #container {
        position: fixed;
        margin: 10px;
        padding: 10px;
        bottom: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.207);
        min-width: 100px;
        min-height: 200px;
        /* max-height: 300px; */
        border-radius: 5px;
    }
</style>
