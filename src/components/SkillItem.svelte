<script lang="ts">
    import type { Skill } from "../lib/api";
    import { styleToString } from "../lib/format";

    export let skill: Skill;
    export let onClick: ((id: Skill) => void) | null = null;
    // export let onClickDelete: ((id: Skill) => void) | null = null;
    export let style: any = {};

    let showDelete = false;

    function handleClick() {
        if (onClick) {
            onClick(skill);
        }
    }

    $: styleString = styleToString(style);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button
    on:click={handleClick}
    on:mouseover={() => (showDelete = true)}
    on:mouseout={() => (showDelete = false)}
    style={styleString}
>
    <h3>{skill.name}</h3>


</button>

<!-- {#if onClickDelete != null && showDelete}
<button
    id="delete-btn"
    on:click={() => onClickDelete(skill)}
    style={styleString}
>
    <h3>X</h3>
</button>
{/if} -->

<style>
    button {
        background-color: rgba(255, 255, 255, 0.24);
        border-radius: 5px;
        padding: 5px;
        margin: 5px;
        max-height: 40px;
        border: none;
        transition-duration: 300ms;
    }

    button:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }

    h3 {
        margin: 2px;
        font-size: 12px;
    }

    #delete-btn {
        position: absolute;
        right: 0;
        top: 0;
        background-color: rgba(255, 0, 0, 0.5);
        border-radius: 50%;
        padding: 5px;
        margin: 5px;
        width: 30px;
        height: 30px;
        border: none;
        transition-duration: 300ms;
        font-size: 14px;
    }
</style>
