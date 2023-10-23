<script lang="ts">
    const pages = ["resume", "map", "resume-map"];

    const currentPage = "map";
</script>

<nav>
    <ul>
        {#each pages as page}
            <li>
                <a href={page}>{page}</a>
            </li>
        {/each}
    </ul>
</nav>

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        min-height: 40px;
        background-color: rgba(240, 248, 255, 0.288);
        z-index: 100;
    }

    ul {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        list-style-type: none;
        margin: 0;
        padding: 10px;
        gap: 20px;
    }
/* 
    li {
        
    } */
</style>
