<script lang="ts">
    import * as d3 from "d3";
    import { ResumeDataset } from "../lib/ResumeDataset";
    import type { Description, Experience } from "../lib/api";
    import { DefaultTooltipState } from "../lib/types/chart-types";
    import type {
        DescriptionMapOptions,
        TooltipState,
    } from "../lib/types/chart-types";
    import { selectedSkillStore } from "../lib/stores/descriptionMapStores";
    import DescriptionPoint from "./DescriptionPoint.svelte";
    import ExperiencePoint from "./ExperiencePoint.svelte";
    import DescriptionTooltip from "./tooltips/DescriptionTooltip.svelte";
    import ExperienceTooltip from "./tooltips/ExperienceTooltip.svelte";
    import CreateModal from "./modals/CreateModal.svelte";
    import { clickOutside } from "../lib/events/click-outside";
    import { isMapShowing } from "../lib/stores/applicationStateStores";
    import { fade } from "svelte/transition";

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
    let createModalPosition: { x: number; y: number } | null = null;

    $: {
        tooltipStates = {};
        dataset.descriptions.forEach(
            (d) => (tooltipStates[d.id] = { ...DefaultTooltipState })
        );
        dataset.experiences.forEach(
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
        switch (type) {
            case "click": {
                console.log("Clicked skill", item);
                if (item == null) {
                    mutateTooltipStates((d) => {
                        d.showLabel = false;
                        d.highlight = false;
                    });
                    return;
                }
                const descriptions = dataset.descriptionsWithSkill(item.id);
                descriptions.forEach((d) => {
                    tooltipStates[d.id].showLabel = true;
                    tooltipStates[d.id].highlight = true;
                });
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
                descriptions.forEach((d) => {
                    tooltipStates[d.id].showLabel = true;
                    tooltipStates[d.id].highlight = true;
                });
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
        const currentlyLocked = tooltipStates[data.id].menuLocked;
        mutateTooltipStates((d) => {
            d.menuLocked = false;
            d.showMenu = false;
        });
        tooltipStates[data.id].menuLocked = !currentlyLocked;
        tooltipStates[data.id].showMenu = true;
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

    function handleExperienceMouseover(event: MouseEvent, data: Experience) {}

    function handleExperienceMouseout(event: MouseEvent, data: Experience) {
        if (!tooltipStates[data.id]) return;
        tooltipStates[data.id].showLabel = false;
    }

    function handleExperienceClick(event: MouseEvent, data: Experience) {
        if (!tooltipStates[data.id]) return;
        tooltipStates[data.id].showLabel = true;
    }

    function handleClickOutside() {
        console.log("clicked outside");
    }

    $: dataset, clearLines();
</script>

<CreateModal position={createModalPosition} />

<div
    class=""
    use:clickOutside
    on:clickOutside={handleClickOutside}
    transition:fade={{ duration: 300 }}
>
    {#each dataset.descriptions as description}
        <DescriptionTooltip
            options={options.descriptionTooltipOptions}
            state={tooltipStates[description.id]}
            {description}
            {dataset}
        />
    {/each}

    {#each dataset.experiences as experience}
        <ExperienceTooltip
            options={options.experienceTooltipOptions}
            state={tooltipStates[experience.id]}
            {experience}
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
                onMouseover={handleExperienceMouseover}
                onMouseout={handleExperienceMouseout}
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

    <button
        class="absolute top-2 right-2 z-100 transition-all duration-300 bg-red-500 hover:bg-red-600 bg-opacity-20 hover:bg-opacity-80 hover:w-9 hover:h-9 text-white w-7 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        on:click={() => {
            console.log("yo clicked");
            isMapShowing.set(false);
        }}
    >
        X
    </button>
</div>

<style>
    svg {
        width: 100vw;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
