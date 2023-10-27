<script lang="ts">
    import * as d3 from "d3";
    import { ResumeDataset } from "../lib/ResumeDataset";
    import type { Description, Experience } from "../lib/api";
    import DescriptionPoint from "./DescriptionPoint.svelte";
    import ExperiencePoint from "./ExperiencePoint.svelte";
    import DescriptionTooltip from "./tooltips/DescriptionTooltip.svelte";

    export let options = {
        descriptionPointOptions: {
            nodeSize: 8,
            hoverSizeMult: 1.5,
            hoverSizeDurationMs: 300,
            tooltipTransitionMs: 100,
            tooltipOpacity: 0.3,
        },
        experiencePointOptions: {
            nodeSize: 0.5,
            hoverSizeMult: 1.1,
            hoverSizeDecayMs: 800,
            opacity: 0.1,
        },
        descriptionTooltipOptions: {
            opacity: 0.3,
            offsetX: 15,
            offsetY: 15,
            anchorSize: 23
        },
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
    };

    export let experiences: Experience[];
    export let width: number;
    export let height: number;

    let viewBox = `0 0 ${width} ${height}`;

    $: dataset = new ResumeDataset(
        experiences,
        [options.margin.left, width - options.margin.right],
        [options.margin.top, height - options.margin.bottom],
        (d) => d.reducedEmbedding[0],
        (d) => d.reducedEmbedding[1]
    );

    interface TooltipData {
        show: boolean;
        locked: boolean;
    }

    let tooltipRecord: Record<string, TooltipData> = {};

    $: {
        tooltipRecord = {};
        dataset.descriptions.forEach(
            (d) => (tooltipRecord[d.id] = { show: false, locked: false })
        );
    }

    function drawLinesToRelatedSkills(description: Description) {
        for (const skillId of description.skillIds) {
            const otherNodes = dataset.descriptionsWithSkill(skillId);
            const lineData = otherNodes.map((other) =>
                dataset.lineBetweenDescriptions(description, other)
            );
            const lines = d3.select("#lines").selectAll("line").data(lineData);
            lines
                .enter()
                .append("line")
                .attr("x1", (d) => d.x1)
                .attr("y1", (d) => d.y1)
                .attr("x2", (d) => d.x1)
                .attr("y2", (d) => d.y1)
                .attr("stroke", "white")
                .attr("stroke-width", 1)
                .attr("opacity", 0.5)
                .transition()
                .duration(200)
                .attr("x2", (d) => d.x2)
                .attr("y2", (d) => d.y2);
        }
    }

    function clearLines() {
        d3.select("#lines").selectAll("line").remove();
    }

    function handleDescriptionClick(event: MouseEvent, data: Description) {
        if (!tooltipRecord[data.id]) return;
        tooltipRecord[data.id].locked = !tooltipRecord[data.id].locked;
    }

    function handleDescriptionMouseover(event: MouseEvent, data: Description) {
        drawLinesToRelatedSkills(data);
        if (!tooltipRecord[data.id]) return;
        tooltipRecord[data.id].show = true;
    }

    function handleDescriptionMouseout(event: MouseEvent, data: Description) {
        if (!tooltipRecord[data.id]) return;
        if (tooltipRecord[data.id].locked) return;
        clearLines();
        tooltipRecord[data.id].show = false;
    }


    function handleExperienceClick(event: MouseEvent, data: Experience) {
        console.log("Clicked experience", data);

        // set all other points to blurred style
        // for(const description of dataset.descriptions) {
        //     if(description.id === data.descriptionId) continue;
        //     tooltipRecord[description.id].locked = true;
        // }
    }
</script>

{#each dataset.descriptions as description}
    <DescriptionTooltip
        show={tooltipRecord[description.id]?.show || false}
        options={options.descriptionTooltipOptions}
        {description}
        {dataset}
        isLocked={tooltipRecord[description.id]?.locked || false}
    />
{/each}

<svg {width} {height} {viewBox}>
    <g id="lines" />

    {#each dataset.experiences as experience}
        <ExperiencePoint
            {experience}
            {dataset}
            options={options.experiencePointOptions}
            onClick={handleExperienceClick}
        />
    {/each}

    {#each dataset.descriptions as description}
        <DescriptionPoint
            {description}
            {dataset}
            options={options.descriptionPointOptions}
            onMouseover={handleDescriptionMouseover}
            onMouseout={handleDescriptionMouseout}
            onClick={handleDescriptionClick}
        />
    {/each}
</svg>

<style>
    svg {
        width: 100vw;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
