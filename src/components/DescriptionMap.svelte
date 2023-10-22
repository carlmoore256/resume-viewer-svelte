<script lang="ts">
    import * as d3 from "d3";
    import type { Experience } from "../lib/api";
    import { centerOfMass, radius } from "../lib/points";
    import { experienceStore } from "../lib/stores/experienceStore";

    interface MapOptions {
        nodeSize: number;
        hoverSizeMult: number;
        tooltipTransitionMs: number;
    }

    export let options: MapOptions = {
        nodeSize: 8,
        hoverSizeMult: 1.5,
        tooltipTransitionMs: 100,
    };

    let svg: SVGElement;
    let tooltip: HTMLDivElement;

    // idea - the map can be invisible, or the dots in the locations
    // of each line on the resume. When a button is clicked, the whole thing
    // transforms and creates this map

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    interface DescriptionPoint {
        id: string;
        x: number;
        y: number;
        cluster: number;
        text: string;
        experienceName: string;
        experienceOrg: string;
        experienceLocation: string;
        // startDate: string;
        // endDate: string | undefined;
    }

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
                // startDate: experience.startDate,
                // endDate: experience.endDate,
            };
        });
    }

    function getMapData() {
        const descriptions = [];
        for (const experience of $experienceStore) {
            descriptions.push(...getDescriptionPoints(experience));
        }

        const experienceCenters = $experienceStore.map((e) => {
            const coords = e.descriptions.map((d) => d.reducedEmbedding);
            return {
                name: e.name,
                center: centerOfMass(coords),
                radius: radius(coords),
            };
        });

        const [minX, maxX] = d3.extent(descriptions.map((d) => d.x));
        const [minY, maxY] = d3.extent(descriptions.map((d) => d.y));

        if (!minX || !minY || !maxX || !maxY) {
            console.log("Range be non-zero numbers");
        }

        return {
            descriptions,
            experienceCenters,
            minX,
            maxX,
            minY,
            maxY,
        };
    }

    function generateMap() {
        const { descriptions, experienceCenters, minX, maxX, minY, maxY } =
            getMapData();

        const width = window.innerWidth;
        const height = window.innerHeight;

        const totalHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        const xScale = d3
            .scaleLinear()
            .domain([minX!, maxX!])
            .range([margin.left, width - margin.right]);
        const yScale = d3
            .scaleLinear()
            .domain([minY!, maxY!])
            .range([height - margin.bottom, margin.top]);

        const colorDomain = Array.from(
            new Set(descriptions.map((d) => d.experienceName.toString()))
        );

        const colorScale = d3
            .scaleOrdinal()
            .domain(colorDomain)
            .range(d3.schemeCategory10);

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
            .attr("r", (d) => d.radius * 200)
            .style("fill", (d) => colorScale(d.name) as string)
            .style("opacity", 0.1)

        _svg.selectAll(".description")
            .data(descriptions)
            .join("circle")
            .classed("description", true)
            .attr("cx", (d) => xScale(d.x))
            .attr("cy", (d) => yScale(d.y))
            .attr("r", options.nodeSize)
            .attr("fill", (d) => colorScale(d.experienceName) as string)
            .on("mouseover", function (d, data) {
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("r", options.nodeSize * options.hoverSizeMult);
                _tooltip
                    .style("left", d.pageX + 15 + "px")
                    .style("top", d.pageY + 15 + "px")
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
            .on("mouseout", function (d) {
                d3.select(this)
                    .transition()
                    .duration(400)
                    .attr("r", options.nodeSize);
                _tooltip
                    .transition()
                    .duration(options.tooltipTransitionMs)
                    .style("opacity", 0);
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
<svg bind:this={svg} />

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
