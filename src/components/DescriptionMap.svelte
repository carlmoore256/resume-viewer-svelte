<script lang="ts">
    import * as d3 from "d3";
    import type { Experience } from "../lib/api";
    import { centerOfMass, radius } from "../lib/points";
    import Tooltip from "./tooltips/Tooltip.svelte";
    import type {
        DescriptionPoint,
        ExperienceCenter,
    } from "../lib/chart-types";
    import type { TooltipContent } from "../lib/chart-types";
    import { hexToRgb, rgbColorToHex } from "../lib/colors";
    import type { RgbColor } from "../lib/colors";
    import ExperienceCreator from "./ExperienceCreator.svelte";
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

    let viewBox = `0 0 ${width} ${height}`;

    let tooltipContent: TooltipContent | null = null;
    let tooltipPos: { x: number; y: number } = { x: 0, y: 0 };
    let showTooltip = false;
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
                    mapData.descriptions.map((d) => d.experienceName.toString())
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
                experienceName: experience.name,
                experienceOrg: experience.organization.name,
                experienceLocation: experience.organization.location,
                startDate: experience.startDate,
                endDate: experience.endDate || "Present",
            };
        });
    }

    function getMapData(experiences: Experience[]) {
        console.log("Getting map data");
        const descriptions = [];
        for (const experience of experiences) {
            descriptions.push(...getDescriptionPoints(experience));
        }
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
            colorScale(data.experienceName) as string
        ) as RgbColor;
        bgColor.a = options.tooltipOpacity;

        tooltipPos = { x: position.x + 15, y: position.y + 15 };

        tooltipContent = {
            title: data.experienceName,
            subtitle: data.text,
            style: {
                maxWidth: "200px",
                backgroundColor: rgbColorToHex(bgColor),
                border: tooltipLocked
                    ? "1px solid rgba(255, 255, 255, 0.5)"
                    : "none",
            },
            html: `<p>${data.experienceOrg}</p>
                <p>${data.experienceLocation}</p>
                <p>${data.startDate} - ${data.endDate}</p>`
        };
        showTooltip = true;
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
    }

    function handleDescriptionMouseout(event: any, data: DescriptionPoint) {
        d3.select(event.currentTarget)
            .transition()
            .duration(400)
            .attr("r", options.nodeSize);
        if (!tooltipLocked) showTooltip = false;
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
</script>

<!-- <svelte:window on:resize={() => generateMap()} /> -->

<DescriptionTooltip
    content={tooltipContent}
    position={tooltipPos}
    show={showTooltip}
    showActions={tooltipLocked}
/>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<svg {width} {height} {viewBox}>
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
        
            >
        </circle>   
    {/each}

    {#each mapData.descriptions as data}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <circle
            class="description"
            cx={xScale(data.x)}
            cy={yScale(data.y)}
            fill={colorScale(data.experienceName)}
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
