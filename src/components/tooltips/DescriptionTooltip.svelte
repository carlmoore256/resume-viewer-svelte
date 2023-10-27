<script lang="ts">
    import { slide } from "svelte/transition";
    import type { DescriptionTooltipOptions } from "../../lib/chart-types";
    import { readableDate } from "../../lib/format";
    import { skillStore } from "../../lib/stores/skillStore";
    import SkillList from "../SkillList.svelte";
    import {
        addSkillToDescription,
        type Description,
        type Skill,
    } from "../../lib/api";
    import { experienceStore } from "../../lib/stores/experienceStore";

    import Tooltip from "./Tooltip.svelte";
    import type { ResumeDataset } from "../../lib/ResumeDataset";
    import { hexToRgb, rgbColorToHex } from "../../lib/colors";

    export let show: boolean = false;
    export let options: DescriptionTooltipOptions;
    export let description: Description;
    export let dataset: ResumeDataset;

    // export let props: DescriptionTooltipProps | null = null;
    export let isLocked = false;
    export let showActions = false;

    // const skills = $skillStore.filter((s) => s.id);

    $: {
        console.log("Yo description tooltip chnaged");
    }

    let allSkillsShowing = false;

    async function onClickSkill(skill: Skill) {
        console.log("Adding skill to description", skill.id);
        const res = await addSkillToDescription(
            description.id as string,
            skill.id
        );
        experienceStore.fetchData();
        console.log("res", res);
    }

    function getColor() {
        let color = dataset.descriptionColor(description);
        let rgb = hexToRgb(color) as any;
        rgb.a = options.opacity;
        return rgbColorToHex(rgb);
    }

    $: position = dataset.descriptionPosition(description);
    $: color = getColor();
    $: experience = dataset.descriptionExperience(description);

</script>

{#if show}
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
            <p>{description.text}</p>
            <p>{experience.organization.location}</p>
            <p>
                {readableDate(experience.startDate)} - {experience.endDate !==
                null
                    ? readableDate(experience.endDate || "")
                    : "Present"}
            </p>
        </Tooltip>

        {#if showActions}
            <div class="actions" transition:slide={{ duration: 300 }}>
                <SkillList
                    skillIds={description.skillIds}
                    onClickAddSkill={() =>
                        (allSkillsShowing = !allSkillsShowing)}
                />
                {#if allSkillsShowing}
                    <div transition:slide={{ duration: 300 }}>
                        <SkillList
                            skillIds={$skillStore.map((s) => s.id)}
                            {onClickSkill}
                        />
                    </div>
                {/if}
            </div>
        {/if}
    </div>
{/if}

<style>
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
