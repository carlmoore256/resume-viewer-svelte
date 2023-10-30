<script lang="ts">
    import * as d3 from "d3";
    import type { Experience } from "../lib/api";
    import { centerOfMass, radius } from "../lib/points";
    import { experienceStore } from "../lib/stores/experienceStore";
    import type {
        DescriptionPoint,
        ExperienceCenter,
    } from "../lib/types/chart-types";

    export let options = {
        nodeSize: 8,
        hoverSizeMult: 1.5,
        tooltipTransitionMs: 100,
        clusterRadius: 200,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
    };

    export let width: number;
    export let height: number;

    let svg: SVGElement;
    let tooltip: HTMLDivElement;

    // runs reactively when experienceStore changes
    $: mapData = getMapData();

    $: xScale = d3
        .scaleLinear()
        .domain([mapData.minX, mapData.maxX])
        .range([options.margin.left, width - options.margin.right]);
    $: yScale = d3
        .scaleLinear()
        .domain([mapData.minY, mapData.maxY])
        .range([height - options.margin.bottom, options.margin.top]);
    $: colorScale = d3
        .scaleOrdinal()
        .domain(
            Array.from(
                new Set(
                    mapData.descriptions.map((d) => d.experienceName.toString())
                )
            )
        )
        .range(d3.schemeCategory10);

    $: renderExperienceCenters(mapData.experienceCenters);

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

    function getMapData() {
        console.log("Getting map data");
        const descriptions = [];
        for (const experience of $experienceStore) {
            descriptions.push(...getDescriptionPoints(experience));
        }
        const experienceCenters: ExperienceCenter[] = $experienceStore.map(
            (e) => {
                const coords = e.descriptions.map((d) => d.reducedEmbedding);
                return {
                    name: e.name,
                    center: centerOfMass(coords),
                    radius: radius(coords),
                };
            }
        );
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

    function renderExperienceCenters(experienceCenters: ExperienceCenter[]) {
        console.log("Rendering experience centers", experienceCenters);
        d3.select(svg)
            .selectAll(".experience")
            .data(experienceCenters)
            .join("circle")
            .classed("experience", true)
            .attr("cx", (d) => {
                console.log(xScale(d.center.x));
                return xScale(d.center.x);
            })
            .attr("cy", (d) => yScale(d.center.y))
            .style("fill", (d) => colorScale(d.name) as string)
            .attr("r", (d) => d.radius * options.clusterRadius)
            .style("opacity", 0.1)
            .on("click", function (event, data) {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("r", data.radius * options.clusterRadius * 1.1);
            })
            .on("mouseout", function (event, data) {
                d3.select(this)
                    .transition()
                    .duration(800)
                    .attr("r", data.radius * 200);
            });
    }

    function generateMap() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const totalHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        const _tooltip = d3
            .select(tooltip)
            .style("opacity", 0)
            .style("position", "absolute")
            .style("font-family", "sans-serif")
            .style("font-size", "12px");

        const _svg = d3.select(svg);

        _svg.attr("width", width)
            .attr("height", totalHeight)
            .selectAll("*")
            .remove()
            .attr("viewBox", [0, 0, width, height]);

        _svg.selectAll(".experience")
            .data(experienceCenters)
            .join("circle")
            .classed("experience", true)
            .attr("cx", (d) => xScale(d.center.x))
            .attr("cy", (d) => yScale(d.center.y))
            .attr("r", (d) => d.radius * options.clusterRadius)
            .style("fill", (d) => colorScale(d.name) as string)
            .style("opacity", 0.1)
            .on("click", function (event, data) {
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("r", data.radius * options.clusterRadius * 1.1);
            })
            .on("mouseout", function (event, data) {
                d3.select(this)
                    .transition()
                    .duration(800)
                    .attr("r", data.radius * 200);
            });

        _svg.selectAll(".description")
            .data(descriptions)
            .join("circle")
            .classed("description", true)
            .attr("cx", (d) => xScale(d.x))
            .attr("cy", (d) => yScale(d.y))
            .attr("r", options.nodeSize)
            .attr("fill", (d) => colorScale(d.experienceName) as string)
            .on("mouseover", function (event, data) {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("r", options.nodeSize * options.hoverSizeMult);
                _tooltip
                    .style("left", event.pageX + 15 + "px")
                    .style("top", event.pageY + 15 + "px")
                    .style(
                        "background-color",
                        colorScale(data.experienceName) as string
                    )
                    .html(
                        `<b>${data.experienceName}</b>
                        <br/> ${data.experienceOrg} | ${data.experienceLocation}
                        <br /> ${data.text}`
                    );
                _tooltip
                    .transition()
                    .duration(options.tooltipTransitionMs)
                    .style("opacity", 1);
            })
            .on("mouseout", function (event, data) {
                d3.select(this)
                    .transition()
                    .duration(400)
                    .attr("r", options.nodeSize);
                _tooltip
                    .transition()
                    .duration(options.tooltipTransitionMs)
                    .style("opacity", 0);
            })
            .on("click", function (event, data) {
                const test = d3.select(this);
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("r", options.nodeSize * options.hoverSizeMult);
                _tooltip
                    .style("left", event.pageX + 15 + "px")
                    .style("top", event.pageY + 15 + "px")
                    .style(
                        "background-color",
                        colorScale(data.experienceName) as string
                    )
                    .html(
                        `<b>${data.experienceName}</b>
                        <br/> ${data.experienceOrg} | ${data.experienceLocation}
                        <br /> ${data.text}`
                    );
            });
    }

    $: {
        if (svg && $experienceStore.length > 0) {
            generateMap();
        }
    }
</script>

<svelte:window on:resize={() => generateMap()} />

<div class="tooltip" bind:this={tooltip} />
<svg bind:this={svg} {width} {height}>
    {#each mapData.experienceCenters as data}
        <circle
            class="experience"
            cx={xScale(data.center.x)}
            cy={yScale(data.center.y)}
            fill={}
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
