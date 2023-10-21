<script lang="ts">
    export let title: string = "";
    export let listItems: string[];
</script>

<div class="container">
    <h3>{title}</h3>
    <ul>
        {#each listItems as item}
            <li>{item}</li>
        {/each}
    </ul>
</div>

<style>
    .container {
        padding: 10px 20px;
        background: rgb(2, 0, 36);
        background: linear-gradient(
            120deg,
            rgba(45, 41, 115, 0.15) 0%,
            rgba(55, 55, 155, 0.15) 34%,
            rgba(94, 56, 121, 0.15) 100%
        );
        border-radius: 10px;
        font-size: 0.85em;
        width: 300px;
    }

    h3 {
        margin: 0;
        padding: 0;
        font-weight: 700;
    }

    ul {
        /* list-style-type: none; */
        padding: 0;
        margin-left: 20px;
    }
</style>
