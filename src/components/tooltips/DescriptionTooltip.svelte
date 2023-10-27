<script lang="ts">
    import { draw, fade, slide, blur, fly } from "svelte/transition";
    import {
        addSkillToDescription,
        removeSkillFromDescription,
        type Description,
        type Skill,
    } from "../../lib/api";
    import type {
        DescriptionTooltipOptions,
        TooltipState,
    } from "../../lib/chart-types";
    import { readableDate } from "../../lib/format";
    import { skillStore } from "../../lib/stores/skillStore";

    import type { ResumeDataset } from "../../lib/ResumeDataset";
    import { hexToRgb, rgbColorToHex } from "../../lib/colors";
    import SkillItem from "../SkillItem.svelte";
    import Tooltip from "./Tooltip.svelte";
    import { updateDescription } from "../../lib/api";
    import { experienceStore } from "../../lib/stores/experienceStore";
    import { Moon } from "svelte-loading-spinners";
    import PointSelectionIndicator from "./PointSelectionIndicator.svelte";

    export let options: DescriptionTooltipOptions;
    export let state: TooltipState;
    export let description: Description;
    export let dataset: ResumeDataset;

    let allSkillsShowing = false;
    let editMode = false;
    let isLoading = false;

    $: skills = description.skillIds
        .map((id) => $skillStore.find((s) => s.id === id))
        .filter((s) => s !== undefined) as Skill[];

    async function onClickNewSkill(skill: Skill) {
        const res = await addSkillToDescription(
            description.id as string,
            skill.id
        );
        if (res) {
            description.skillIds.push(skill.id);
            description = description;
        }
    }

    async function onClickExistingSkill(skill: Skill) {
        const res = await removeSkillFromDescription(
            description.id as string,
            skill.id
        );

        if (res) {
            description.skillIds = description.skillIds.filter(
                (id) => id !== skill.id
            );
            description = description;
        }
    }

    function getColor(transparency: number) {
        let color = dataset.descriptionColor(description);
        let rgb = hexToRgb(color) as any;
        rgb.a = transparency;
        return rgbColorToHex(rgb);
    }

    function onClickText() {
        console.log("clicked text");
        if (editMode) return;
        editMode = true;
    }

    async function onSubmitText() {
        editMode = false;
        isLoading = true;
        console.log(`Updating description: ${description.id}`);
        const res = await updateDescription(description.id, description.text);
        if (res && res.status === "success") {
            console.log(`Updated description: ${res}`);
            experienceStore.fetchData();
            isLoading = false;
        }
    }

    function handleTextareaKey(event: any) {
        // Check if the pressed key is "Enter" and there's no modifier key pressed (like Shift)
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevent a newline
            onSubmitText(); // Submit the content
        }
    }

    $: position = dataset.descriptionPosition(description);
    $: experience = dataset.descriptionExperience(description);
</script>

{#if state.showLabel}
    <div
        in:fly={{ duration: 300 }}
        id="label"
        style={`top: ${position.y + options.offsetY}px; left: ${
            position.x + options.offsetX
        }px; background-color: ${getColor(options.opacity)};`}
    >
        <p>{experience.name}</p>
    </div>
{/if}

{#if state.showMenu || state.highlight}
    <PointSelectionIndicator
        {position}
        size={options.anchorSize}
        color={getColor(0.8)}
        opacity={options.opacity}
        dashed={state.menuLocked}
    />
{/if}

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if state.showMenu}
    <div
        class="container"
        style={`top: ${position.y + options.offsetY}px; left: ${
            position.x + options.offsetX
        }px;`}
    >
        <Tooltip
            title={experience.name}
            style={{
                maxWidth: "200px",
                backgroundColor: getColor(options.opacity),
                border: state.menuLocked
                    ? "1px solid rgba(255, 255, 255, 0.5)"
                    : "none",
                position: "relative",
            }}
        >
            <div id="description-text">
                {#if editMode}
                    <textarea
                        id="description-input"
                        bind:value={description.text}
                        on:blur={() => (editMode = false)}
                        on:keydown={handleTextareaKey}
                    />
                    <button id="submit-text" on:click={onSubmitText}>
                        Submit
                    </button>
                    <button
                        id="cancel-text"
                        on:click={() => (editMode = false)}
                    >
                        Cancel
                    </button>
                {:else}
                    <p on:click={onClickText}>{description.text}</p>
                {/if}
            </div>

            {#if isLoading}
                <div id="loading">
                    <Moon size="25" color={getColor(1)} />
                </div>
            {/if}

            <p>{experience.organization.location}</p>
            <p>
                {readableDate(experience.startDate)} - {experience.endDate !==
                null
                    ? readableDate(experience.endDate || "")
                    : "Present"}
            </p>
        </Tooltip>

        <div class="actions" transition:slide={{ duration: 300 }}>
            <div id="existing-skills">
                {#each skills as skill}
                    <SkillItem {skill} onClick={onClickExistingSkill} />
                {/each}
                {#if state.menuLocked}
                    <button
                        id="add-btn"
                        transition:fade={{ duration: 100 }}
                        on:click={() => (allSkillsShowing = !allSkillsShowing)}
                    >
                        +
                    </button>
                {/if}
            </div>

            {#if state.menuLocked && allSkillsShowing}
                <div transition:slide={{ duration: 300 }}>
                    {#each $skillStore as skill}
                        {#if !description.skillIds.includes(skill.id)}
                            <SkillItem
                                {skill}
                                onClick={onClickNewSkill}
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                                }}
                            />
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    #label {
        position: absolute;
        background-color: rgba(240, 248, 255, 0.24);
        z-index: 999;
        padding: 4px;
        border-radius: 5px;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(252, 252, 252, 0.123);
    }

    #label p {
        font-size: 12px;
        margin: 0;
    }

    #loading {
        position: absolute;
        top: 0;
        right: 0;
        padding: 6px;
    }

    #submit-text {
        z-index: 999;
    }

    #description-input {
        background-color: rgba(255, 255, 255, 0.5);
        color: black;
        border: none;
        border-radius: 5px;
        padding: 5px;
        margin: 5px;
        height: 100px;
    }

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

    #add-btn:hover {
        background-color: rgba(68, 131, 68, 0.8);
    }

    .actions {
        position: relative;
        height: 30px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5px;
        margin: 8px 0;
        justify-content: left;
    }

    .container {
        position: absolute;
        z-index: 100;
        max-width: 200px;
    }
    p {
        font-size: 12px;
    }
</style>
