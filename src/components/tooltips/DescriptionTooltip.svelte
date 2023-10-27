<script lang="ts">
    import { draw, fade, slide } from "svelte/transition";
    import {
        addSkillToDescription,
        removeSkillFromDescription,
        type Description,
        type Skill,
    } from "../../lib/api";
    import type { DescriptionTooltipOptions } from "../../lib/chart-types";
    import { readableDate } from "../../lib/format";
    import { skillStore } from "../../lib/stores/skillStore";

    import type { ResumeDataset } from "../../lib/ResumeDataset";
    import { hexToRgb, rgbColorToHex } from "../../lib/colors";
    import SkillItem from "../SkillItem.svelte";
    import Tooltip from "./Tooltip.svelte";

    export let show: boolean = false;
    export let options: DescriptionTooltipOptions;
    export let description: Description;
    export let dataset: ResumeDataset;
    export let isLocked = false;

    let allSkillsShowing = false;

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

    function getColor() {
        let color = dataset.descriptionColor(description);
        let rgb = hexToRgb(color) as any;
        rgb.a = options.opacity;
        return rgbColorToHex(rgb);
    }

    function onClickText() {
        console.log("clicked text");
        editMode = !editMode;
    }

    $: position = dataset.descriptionPosition(description);
    $: color = getColor();
    $: experience = dataset.descriptionExperience(description);

    let editMode = false;
</script>

{#if show}
    <div
        id="anchor-point"
        style={`
        top: ${position.y - options.anchorSize}px; 
        left: ${position.x - options.anchorSize}px;
        width: ${options.anchorSize * 2}px;
        height: ${options.anchorSize * 2}px;
        `}
    >
        <svg>
            <path
                d={`M ${options.anchorSize},${
                    options.anchorSize - options.anchorSize * 0.8
                } a ${options.anchorSize * 0.8},${
                    options.anchorSize * 0.8
                } 0 1,0 0,${options.anchorSize * 0.8 * 2} a ${
                    options.anchorSize * 0.8
                },${options.anchorSize * 0.8} 0 1,0 0,-${
                    options.anchorSize * 0.8 * 2
                }`}
                opacity={options.opacity}
                stroke={color}
                stroke-width="4"
                stroke-dasharray={isLocked ? "3,3" : "none"}
                fill="none"
                in:draw={{ duration: 500 }}
                out:draw={{ duration: 500 }}
            />
        </svg>
    </div>
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
                backgroundColor: color,
                border: isLocked
                    ? "1px solid rgba(255, 255, 255, 0.5)"
                    : "none",
                position: "relative",
            }}
        >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div id="description-text" on:click={onClickText} on:mouseenter={onClickText}>
                {#if editMode}
                    <input
                        type="text"
                        bind:value={description.text}
                        on:blur={() => (editMode = false)}
                    />
                {:else}
                    <p>{description.text}</p>
                {/if}
            </div>
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
                {#if isLocked}
                    <button
                        id="add-btn"
                        transition:fade={{ duration: 100 }}
                        on:click={() => (allSkillsShowing = !allSkillsShowing)}
                    >
                        +
                    </button>
                {/if}
            </div>

            {#if isLocked && allSkillsShowing}
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
    #anchor-point {
        position: absolute;
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
