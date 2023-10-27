<script lang="ts">
    import * as d3 from "d3";
    import type { Description, Experience } from "../lib/api";
    import { centerOfMass, radius } from "../lib/points";
    import Tooltip from "./tooltips/Tooltip.svelte";
    import type {
        DescriptionPoint,
        ExperienceCenter,
    } from "../lib/chart-types";
    import type {
        TooltipContent,
        DescriptionTooltipProps,
    } from "../lib/chart-types";
    import { hexToRgb, rgbColorToHex } from "../lib/colors";
    import type { RgbColor } from "../lib/colors";
    import DescriptionTooltip from "./tooltips/DescriptionTooltip.svelte";

    export let options = {
        nodeSize: 8,
        hoverSizeMult: 1.5,
        tooltipTransitionMs: 100,
        tooltipOpacity: 0.3,
        clusterRadius: 200,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
    };

    export let experiences: Experience[];
    export let width: number;
    export let height: number;

    function experienceById(id: string): Experience | undefined {
        return experiences.find((e) => e.id === id);
    }

    let viewBox = `0 0 ${width} ${height}`;

    let descriptionTooltipProps: DescriptionTooltipProps | null = null;

    // let tooltipPos: { x: number; y: number } = { x: 0, y: 0 };
    let tooltipLocked = false;
    let displayText: { x: number; y: number; text: string } | null = null;

    // runs reactively when experienceStore changes
    $: mapData = getMapData(experiences);

    $: xScale = d3
        .scaleLinear()
        .domain([mapData.minX, mapData.maxX])
        .range([options.margin.left, width - options.margin.right]);
    $: yScale = d3
        .scaleLinear()
        .domain([mapData.minY, mapData.maxY])
        .range([height - options.margin.bottom, options.margin.top]);
    $: colorScale = d3
        .scaleOrdinal<string>()
        .domain(
            Array.from(
                new Set(
                    mapData.descriptions.map((d) =>
                        d.experience.name.toString()
                    )
                )
            )
        )
        .range(d3.schemeCategory10);

    function getDescriptionPoints(experience: Experience): DescriptionPoint[] {
        return experience.descriptions.map((d) => {
            return {
                id: d.id,
                x: d.reducedEmbedding[0],
                y: d.reducedEmbedding[1],
                cluster: d.kmeansLabel,
                text: d.text,
                skillIds: d.skillIds,
                experience,
                // cluster: d.kmeansLabel,
                // text: d.text,
                // experienceName: experience.name,
                // experienceOrg: experience.organization.name,
                // experienceLocation: experience.organization.location,
                // startDate: experience.startDate,
                // endDate: experience.endDate || "Present",
            };
        });
    }

    function getMapData(experiences: Experience[]) {
        console.log("Getting map data");
        const descriptions = experiences.flatMap((e) =>
            getDescriptionPoints(e)
        );
        const experienceCenters: ExperienceCenter[] = experiences.map((e) => {
            const coords = e.descriptions.map((d) => d.reducedEmbedding);
            let r = radius(coords);
            if (!isFinite(r)) r = 0;
            return {
                name: e.name,
                center: centerOfMass(coords),
                radius: r,
            };
        });
        const [minX, maxX] = d3.extent(descriptions.map((d) => d.x));
        const [minY, maxY] = d3.extent(descriptions.map((d) => d.y));
        return {
            descriptions,
            experienceCenters,
            minX: minX || 0,
            maxX: maxX || 1,
            minY: minY || 0,
            maxY: maxY || 1,
        };
    }

    function setDescriptionTooltip(
        data: DescriptionPoint,
        position: { x: number; y: number }
    ) {
        let bgColor = hexToRgb(
            colorScale(data.experience.name) as string
        ) as RgbColor;
        bgColor.a = options.tooltipOpacity;

        descriptionTooltipProps = {
            data: data,
            position: { x: position.x + 15, y: position.y + 15 },
            color: rgbColorToHex(bgColor),
        };
    }

    function handleExpCenterMouseover(event: any, data: ExperienceCenter) {
        displayText = {
            x: xScale(data.center.x),
            y: yScale(data.center.y),
            text: data.name,
        };
    }

    function handleExpCenterClick(event: any, data: ExperienceCenter) {
        d3.select(event.currentTarget)
            .transition()
            .duration(300)
            .attr("r", data.radius * options.clusterRadius * 1.1);
    }

    function handleExpCenterMouseout(event: any, data: ExperienceCenter) {
        d3.select(event.currentTarget)
            .transition()
            .duration(800)
            .attr("r", data.radius * 200);
    }

    function handleDescriptionMouseover(event: any, data: DescriptionPoint) {
        d3.select(event.currentTarget)
            .transition()
            .duration(100)
            .attr("r", options.nodeSize * options.hoverSizeMult);
        if (!tooltipLocked) {
            setDescriptionTooltip(data, {
                x: event.clientX,
                y: event.clientY,
            });
        }

        // draw lines from this to all other descriptions that have the same skill

        for (const skillId of data.skillIds) {
            const otherNodes = mapData.descriptions
                .map((d) => (d.skillIds.includes(skillId) ? d : null))
                .filter((d) => d !== null && d.id !== data.id) as DescriptionPoint[];

            console.log("otherNodes", otherNodes);
            
            const xStart = xScale(data.x);
            const yStart = yScale(data.y);
            const xEnds = otherNodes.map((d) => xScale(d.x));
            const yEnds = otherNodes.map((d) => yScale(d.y));

            const lineData = xEnds.map((x, i) => {
                return {
                    x1: xStart,
                    y1: yStart,
                    x2: x,
                    y2: yEnds[i],
                };
            });

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

    function handleDescriptionMouseout(event: any, data: DescriptionPoint) {
        d3.select(event.currentTarget)
            .transition()
            .duration(400)
            .attr("r", options.nodeSize);
        if (!tooltipLocked) descriptionTooltipProps = null;

        d3.select("#lines").selectAll("line").remove();
    }

    function handleDescriptionClick(event: any, data: DescriptionPoint) {
        d3.select(event.currentTarget)
            .transition()
            .duration(300)
            .attr("r", options.nodeSize * options.hoverSizeMult);

        tooltipLocked = !tooltipLocked;
        setDescriptionTooltip(data, {
            x: event.clientX,
            y: event.clientY,
        });
    }

    function onSvgClicked() {
        // if (tooltipLocked) {
        //     tooltipLocked = false;
        // }
    }
</script>

<svelte:window on:resize={() => (mapData = getMapData(experiences))} />



<DescriptionTooltip
    props={descriptionTooltipProps}
    showActions={tooltipLocked}
    isLocked={tooltipLocked}
/>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg {width} {height} {viewBox} on:click={onSvgClicked}>
    <!-- {#if displayText}
        <text
            id="display-text"
            x={displayText.x}
            y={displayText.y}
            font-size="14px"
            text-anchor="middle"
            alignment-baseline="middle"
            font-family="sans-serif"
            fill="rgba(255, 255, 255, 0.8)"
        >
            {displayText.text}
        </text>
    {/if} -->

    <g id="lines"></g>

    {#each mapData.experienceCenters as data}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <circle
            class="experience"
            cx={xScale(data.center.x)}
            cy={yScale(data.center.y)}
            fill={colorScale(data.name)}
            r={data.radius * options.clusterRadius}
            opacity={0.1}
            on:click={(event) => handleExpCenterClick(event, data)}
            on:mouseover={(event) => handleExpCenterMouseover(event, data)}
            on:mouseleave={(event) => handleExpCenterMouseout(event, data)}
        />
    {/each}

    {#each mapData.descriptions as data}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <circle
            class="description"
            cx={xScale(data.x)}
            cy={yScale(data.y)}
            fill={colorScale(data.experience.name)}
            r={options.nodeSize}
            opacity={1}
            on:mouseover={(event) => handleDescriptionMouseover(event, data)}
            on:mouseleave={(event) => handleDescriptionMouseout(event, data)}
            on:click={(event) => handleDescriptionClick(event, data)}
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

    .tooltip {
        background-color: rgba(71, 26, 72, 0.785);
        border-radius: 5px;
        padding: 5px;
        filter: drop-shadow(0px 0px 3px rgba(66, 46, 46, 0.209));
        min-width: 200px;
        max-width: 400px;
        z-index: 21;
    }
</style>
