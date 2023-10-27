<script lang="ts">
    import * as d3 from "d3";
    import { ResumeDataset } from "../lib/ResumeDataset";
    import type { Description, Experience } from "../lib/api";
    import type {
        DescriptionMapOptions,
        TooltipState,
    } from "../lib/chart-types";
    import { DefaultTooltipState } from "../lib/chart-types";
    import { selectedSkillStore } from "../lib/stores/descriptionMapStores";
    import DescriptionPoint from "./DescriptionPoint.svelte";
    import ExperiencePoint from "./ExperiencePoint.svelte";
    import DescriptionTooltip from "./tooltips/DescriptionTooltip.svelte";

    export let options: DescriptionMapOptions;
    export let experiences: Experience[];
    export let width: number;
    export let height: number;

    $: dataset = new ResumeDataset(
        experiences,
        [options.margin.left, width - options.margin.right],
        [options.margin.top, height - options.margin.bottom],
        (d) => d.reducedEmbedding[0],
        (d) => d.reducedEmbedding[1]
    );

    let tooltipStates: Record<string, TooltipState> = {};

    $: {
        tooltipStates = {};
        dataset.descriptions.forEach(
            (d) => (tooltipStates[d.id] = { ...DefaultTooltipState })
        );
    }

    function mutateTooltipStates(callback: (s: TooltipState) => void) {
        dataset.descriptions.forEach((d) => {
            const state = tooltipStates[d.id];
            callback(state);
            tooltipStates[d.id] = state;
        });
    }

    selectedSkillStore.subscribe(({ item, type }) => {
        if (!dataset) return;

        // if (item == null) {
        //     mutateTooltipStates((d) => (d = {...DefaultTooltipState}));
        //     return;
        // }


        switch (type) {
            case "click": {
                console.log("Clicked skill", item)
                if (item == null) {
                    mutateTooltipStates((d) => {
                        d.showLabel = false;
                        d.highlight = false;
                    });
                    return;
                }
                const descriptions = dataset.descriptionsWithSkill(item.id);
                descriptions.forEach(
                    (d) => {
                        tooltipStates[d.id].showLabel = true;
                        tooltipStates[d.id].highlight = true;
                    }
                );
                break;
            }

            case "hover": {
                if (item == null) {
                    mutateTooltipStates((d) => {
                        d.showLabel = false;
                        d.highlight = false;
                    });
                    return;
                }
                const descriptions = dataset.descriptionsWithSkill(item.id);
                descriptions.forEach(
                    (d) => {
                        tooltipStates[d.id].showLabel = true;
                        tooltipStates[d.id].highlight = true;
                    }
                );
                break;
            }
        }
    });

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
        if (!tooltipStates[data.id]) return;
        tooltipStates[data.id].menuLocked = !tooltipStates[data.id].menuLocked;
    }

    function handleDescriptionMouseover(event: MouseEvent, data: Description) {
        drawLinesToRelatedSkills(data);
        if (!tooltipStates[data.id]) return;
        tooltipStates[data.id].showMenu = true;
    }

    function handleDescriptionMouseout(event: MouseEvent, data: Description) {
        if (!tooltipStates[data.id]) return;
        if (tooltipStates[data.id].menuLocked) return;
        clearLines();
        tooltipStates[data.id].showMenu = false;
    }

    function handleExperienceClick(event: MouseEvent, data: Experience) {
        console.log("Clicked experience", data);

        // set all other points to blurred style
        // for(const description of dataset.descriptions) {
        //     if(description.id === data.descriptionId) continue;
        //     tooltipRecord[description.id].locked = true;
        // }
    }

    $: dataset, clearLines();
</script>

{#each dataset.descriptions as description}
    <DescriptionTooltip
        options={options.descriptionTooltipOptions}
        state={tooltipStates[description.id]}
        {description}
        {dataset}
    />
{/each}

<svg {width} {height}>
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
