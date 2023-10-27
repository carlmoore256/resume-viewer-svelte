<script lang="ts">
    import { slide } from "svelte/transition";
    import type { Skill } from "../lib/api";
    import { skillStore } from "../lib/stores/skillStore";
    import SkillItem from "./SkillItem.svelte";
    import { styleToString } from "../lib/format";
    import { currentContactStore } from "../lib/stores/currentContactStore";
    import { selectedSkillStore } from "../lib/stores/descriptionMapStores";

    export let skills: Skill[];
    export let onClickSkill: ((id: Skill) => void) | null = null;
    export let style: any = {};

    let creatingNewSkill = false;
    let newSkillName = "";

    function onClickAdd() {
        console.log("Clicked add skill");
        creatingNewSkill = true;
        newSkillName = "";
    }

    function onSkillClicked(skill: Skill) {
        selectedSkillStore.set({ item: skill, type: "click" });
        if (onClickSkill) {
            onClickSkill(skill);
        }
    }

    function onSkillMouseover(skill: Skill) {
        selectedSkillStore.set({ item: skill, type: "hover" });
    }

    function onSkillMouseout(skill: Skill) {
        selectedSkillStore.set({ item: null, type: "hover" });
    }

    let expanded = false;
</script>

<div class="container prevent-select" style={styleToString(style)}>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div id="header" on:click={() => (expanded = !expanded)}>
        <h3>Skills</h3>
    </div>
    {#if expanded}
        <div id="skills" transition:slide={{ duration: 300 }}>
            {#each skills as skill}
                {#if skill}
                    <SkillItem
                        {skill}
                        onClick={() => {onSkillClicked(skill)}}
                        onMouseover={onSkillMouseover}
                        onMouseout={onSkillMouseout}
                    />
                {/if}
            {/each}
            <button id="add-btn" on:click={onClickAdd}> + </button>

            {#if creatingNewSkill}
                <div id="new-skill">
                    <input type="text" bind:value={newSkillName} />

                    <button
                        on:click={() => {
                            skillStore.addSkill(
                                newSkillName,
                                $currentContactStore.id
                            );
                            creatingNewSkill = false;
                        }}>Add</button
                    >
                    <button on:click={() => (creatingNewSkill = false)}
                        >Cancel</button
                    >
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    #add-btn {
        background-color: rgba(255, 255, 255, 0.24);
        border-radius: 5px;
        padding: 5px;
        margin: 5px;
        max-height: 40px;
        border: none;
        transition-duration: 300ms;
    }

    #add-btn:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }

    #new-skill {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 6px;
        background-color: rgba(31, 31, 31, 0.527);
        border-radius: 4px;
    }

    .container {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: left;
        z-index: 100;
        max-width: 100%;
        min-width: 120px;
        /* padding: 10px; */
        background-color: rgba(240, 248, 255, 0.123);
        backdrop-filter: blur(10px);
        border-radius: 5px;
        filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.247));
        border: 1px solid rgba(0, 0, 0, 0.123);
    }

    #skills {
        padding: 4px;
    }

    #header {
        display: flex;
        background-color: rgba(27, 27, 27, 0.993);
        border-radius: 4px;
        padding: 5px;
    }

    h3 {
        margin: 2px;
        font-weight: 200;
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
