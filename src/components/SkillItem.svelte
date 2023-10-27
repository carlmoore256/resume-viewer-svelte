<script lang="ts">
    import type { Skill } from "../lib/api";

    export let skill: Skill;
    export let onClick: ((id: Skill) => void) | null = null;

    function handleClick() {
        if (onClick) {
            console.log("yo clicked!", skill)
            onClick(skill);
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<button on:click={handleClick}>
    <h3>{skill.name}</h3>
</button>

<style>
    button {
        background-color: rgba(255, 255, 255, 0.24);
        border-radius: 5px;
        padding: 5px;
        margin: 5px;
        max-height: 40px;
        border: none;
    }

    h3 {
        margin: 2px;
        font-size: 12px;
    }
</style>
