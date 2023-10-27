<script lang="ts">
    import { slide } from "svelte/transition";
    import type { DescriptionTooltipProps } from "../../lib/chart-types";
    import { readableDate } from "../../lib/format";
    import { skillStore } from "../../lib/stores/skillStore";
    import SkillList from "../SkillList.svelte";
    import { addSkillToDescription, type Skill } from "../../lib/api";
    import { experienceStore } from "../../lib/stores/experienceStore";

    import Tooltip from "./Tooltip.svelte";

    export let props: DescriptionTooltipProps | null = null;
    export let isLocked = false;
    export let showActions = false;

    // const skills = $skillStore.filter((s) => s.id);

    let allSkillsShowing = false;

    async function onClickSkill(skill: Skill) {
        console.log("Adding skill to description", skill.id);
        const res = await addSkillToDescription(
            props?.data.id as string,
            skill.id
        );
        experienceStore.fetchData();
        console.log("res", res);
    }
</script>

{#if props}
    <div
        class="container"
        style={`top: ${props.position.y}px; left: ${props.position.x}px;`}
    >
        <Tooltip
            title={props.data.experience.name}
            style={{
                maxWidth: "200px",
                backgroundColor: props.color,
                border: isLocked
                    ? "1px solid rgba(255, 255, 255, 0.5)"
                    : "none",
                position: "relative",
            }}
        >
            <p>{props.data.text}</p>
            <p>{props.data.experience.organization.location}</p>
            <p>
                {readableDate(props.data.experience.startDate)} - {props.data
                    .experience.endDate !== null
                    ? readableDate(props.data.experience.endDate || "")
                    : "Present"}
            </p>
        </Tooltip>

        {#if showActions}
            <div class="actions" transition:slide={{ duration: 300 }}>
                <SkillList
                    skillIds={props.data.skillIds}
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
