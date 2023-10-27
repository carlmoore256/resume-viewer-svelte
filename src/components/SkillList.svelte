<script lang="ts">
    import type { Skill } from "../lib/api";
    import { skillStore } from "../lib/stores/skillStore";
    import SkillItem from "./SkillItem.svelte";
    import { styleToString } from "../lib/format";

    export let skillIds: string[] = [];
    export let onClickAddSkill: Function | null = null;
    export let onClickSkill: ((id: Skill) => void) | null = null;
    export let style: any = {};

    const skills = skillIds.map((id) => $skillStore.find((s) => s.id === id));

    function handleClickAddSkill() {
        if (onClickAddSkill) {
            onClickAddSkill();
        }
    }
</script>

<div class="container" style={styleToString(style)}>
    {#if onClickAddSkill}
        <button on:click={handleClickAddSkill}>Add Skill</button>
    {/if}
    {#each skills as skill}
        {#if skill}
            <SkillItem {skill} onClick={onClickSkill} />
        {/if}
    {/each}
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: left;
        z-index: 100;
        max-width: 100%;
    }

    button {
        border-radius: 10px;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        padding: 5px;
        margin: 5px;
        max-height: 40px;
    }
</style>
