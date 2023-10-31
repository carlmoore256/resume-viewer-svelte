<script lang="ts">
    import { scale, slide } from "svelte/transition";
    import type { Skill } from "../lib/api-types";
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

    let selectedSkill: Skill | null = null;

    function onSkillClicked(skill: Skill) {
        if (selectedSkill !== null && selectedSkill.id == skill.id) {
            selectedSkill = null;
            return;
        }
        selectedSkill = skill;
        selectedSkillStore.set({ item: skill, type: "click" });
        if (onClickSkill) {
            onClickSkill(skill);
        }
    }

    function onSkillMouseover(skill: Skill) {
        selectedSkillStore.set({ item: skill, type: "hover" });
    }

    function onSkillMouseout(skill: Skill) {
        if (selectedSkill !== null && selectedSkill.id == skill.id) {
            return;
        }
        selectedSkillStore.set({ item: null, type: "hover" });
        selectedSkill = null;
    }

    function handleDescriptionKey(event: any) {
        if (event.key == "Enter") {
            skillStore.addSkill(newSkillName, $currentContactStore.id);
            creatingNewSkill = false;
        }
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
        <div
            id="skills max-h-5 overflow-scroll"
            transition:slide={{ duration: 300 }}
        >
            {#each skills as skill}
                {#if skill}
                    <SkillItem
                        {skill}
                        onClick={() => {
                            onSkillClicked(skill);
                        }}
                        onMouseover={onSkillMouseover}
                        onMouseout={onSkillMouseout}
                        style={{
                            backgroundColor:
                                selectedSkill !== null &&
                                selectedSkill.id == skill.id
                                    ? "rgba(90, 224, 112, 0.5)"
                                    : "rgba(255, 255, 255, 0.24)",
                        }}
                    />
                {/if}
            {/each}
            <button id="add-btn" on:click={onClickAdd}> + </button>
        </div>
    {/if}
</div>

{#if creatingNewSkill}
    <div
        class="input-modal"
        in:scale={{ duration: 300 }}
        out:scale={{ duration: 300 }}
    >
        <h3>Add New Skill</h3>

        <div class="modal-row">
            <input
                id="new-skill-name"
                type="text"
                on:keydown={handleDescriptionKey}
                bind:value={newSkillName}
            />
        </div>
        <div class="modal-row">
            <button
                on:click={() => {
                    skillStore.addSkill(newSkillName, $currentContactStore.id);
                    creatingNewSkill = false;
                }}>Add</button
            >
            <button on:click={() => (creatingNewSkill = false)}>Cancel</button>
        </div>
    </div>
{/if}

<style>
    #add-btn {
        border-radius: 50%;
        padding: 5px;
        margin: 5px;
        width: 30px;
        height: 30px;
        border: none;
        background-color: rgba(68, 131, 68, 0.507);
        transition-duration: 300ms;
        font-size: 14px;
    }

    .input-modal {
        display: flex;
        flex-direction: column;
        padding: 6px 10px;
        position: absolute;
        margin-top: 10px;
        /* max-height: 40px; */
        background-color: rgb(14, 14, 14);
        filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.247));
        border-radius: 4px;
        justify-content: left;
    }

    .modal-row {
        display: flex;
        justify-content: left;
        align-items: center;
    }

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
        filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.425));
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
