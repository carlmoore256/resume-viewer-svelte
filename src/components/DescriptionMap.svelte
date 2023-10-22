<script lang="ts">
    import { onMount } from "svelte";
    import { getExperiences } from "../lib/api";
    import type { Experience, Description } from "../lib/api";
    import { centerOfMass, radius, distance } from "../lib/points";
    import { experienceStore } from "../lib/stores/experienceStore";
    import { storeForId } from "../lib/stores/writableDataStore";
    import * as d3 from "d3";

    export let isActivated = false;
    let svg: SVGElement;
    let container: HTMLDivElement;
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
        bulletElement: HTMLElement | null;
        // startDate: string;
        // endDate: string | undefined;
    }

    let svgBullets = [];

    function generateMap() {
        const allDescriptions: DescriptionPoint[] = [];

        for (const {
            descriptions,
            name,
            organization,
            startDate,
            endDate,
        } of $experienceStore) {
            const points = descriptions.map((d) => {
                // console.log()
                return {
                    id: d.id,
                    x: d.reducedEmbedding[0],
                    y: d.reducedEmbedding[1],
                    cluster: d.kmeansLabel,
                    text: d.text,
                    experienceName: name,
                    experienceOrg: organization.name,
                    experienceLocation: organization.location,
                    bulletElement: document.getElementById(`bullet_${d.id}`),
                    // startDate,
                    // endDate
                };
            });
            allDescriptions.push(...points);
        }

        const experienceCenters = $experienceStore.map((e) => {
            const coords = e.descriptions.map((d) => d.reducedEmbedding);
            return {
                name: e.name,
                center: centerOfMass(coords),
                radius: radius(coords),
            };
        });

        // const clusterCenters = experiences.map(e => e.name);

        const [minX, maxX] = d3.extent(allDescriptions.map((d) => d.x));
        const [minY, maxY] = d3.extent(allDescriptions.map((d) => d.y));

        if (!minX || !minY || !maxX || !maxY) {
            console.log("Range be non-zero numbers");
            return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        const _svg = d3.select(svg);

        _svg.attr("width", width)
            .attr("height", height)
            .selectAll("*")
            .remove()
            .attr("viewBox", [0, 0, width, height]);

        const xScale = d3
            .scaleLinear()
            .domain([minX, maxX])
            .range([margin.left, width - margin.right]);
        const yScale = d3
            .scaleLinear()
            .domain([minY, maxY])
            .range([height - margin.bottom, margin.top]);

        const colorDomain = Array.from(
            new Set(allDescriptions.map((d) => d.experienceName.toString()))
        );

        const colorScale = d3
            .scaleOrdinal()
            .domain(colorDomain)
            .range(d3.schemeCategory10);

        var div = d3
            .select(tooltip)
            .style("opacity", 0)
            .style("position", "absolute")
            .style("font-family", "sans-serif")
            .style("font-size", "12px");

        _svg.selectAll("circle")
            .data(allDescriptions)
            .join("circle")
            .attr("cx", (d) =>
                isActivated
                    ? xScale(d.x)
                    : d.bulletElement!.getBoundingClientRect().left +
                      window.scrollX
            )
            .attr("cy", (d) =>
                isActivated
                    ? yScale(d.y)
                    : d.bulletElement!.getBoundingClientRect().top +
                      window.scrollY
            )
            .attr("r", 10)
            .attr("fill", (d) => colorScale(d.experienceName) as string)
            .on("mouseover", function (d, data) {
                d3.select(this).transition().duration(100).attr("r", 15);

                const descriptionStore = storeForId(d.id);

                const { pageX, pageY } = d;

                div.style("left", pageX + 15 + "px")
                    .style("top", pageY + 15 + "px")
                    .style(
                        "background-color",
                        colorScale(data.experienceName) as string
                    )
                    .html(
                        `<b>${data.experienceName}</b> 
                        <br/> ${data.experienceOrg} | ${data.experienceLocation} 
                        <br /> ${data.text}
                        <br /> ${descriptionStore}`
                    );

                div.transition().duration(50).style("opacity", 1);
            })
            .on("mouseout", function (d) {
                d3.select(this).transition().duration(400).attr("r", 10);
                d3.select(".test").style("opacity", 0);
                div.transition().duration(50).style("opacity", 0);
            });

        allDescriptions.forEach((d) => {
            d3.select(d.bulletElement)
                .append("svg")
                .attr("width", 10)
                .attr("height", 10);
            svgBullets.push();
        });
    }

    function drawCircles(node: HTMLElement, descriptions: DescriptionPoint[]) {
        const allDescriptions: DescriptionPoint[] = [];
        const [minX, maxX] = d3.extent(descriptions.map((d) => d.x));
        const [minY, maxY] = d3.extent(descriptions.map((d) => d.y));

        if (!minX || !minY || !maxX || !maxY) {
            console.log("Range be non-zero numbers");
            return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        const xScale = d3
            .scaleLinear()
            .domain([minX, maxX])
            .range([margin.left, width - margin.right]);
        const yScale = d3
            .scaleLinear()
            .domain([minY, maxY])
            .range([height - margin.bottom, margin.top]);
        const colorDomain = Array.from(
            new Set(descriptions.map((d) => d.experienceName.toString()))
        );
    }

    $: {
        if (svg && $experienceStore.length > 0) {
            generateMap();

            if (isActivated) {
                container.style.position = "fixed";
            } else {
                container.style.position = "absolute";
            }
        }
    }

    // $: line = d3.line((d, i) => x(i), y);
</script>

<svelte:window on:resize={() => generateMap()} />

<div class="container" bind:this={container}>
    <div class="tooltip" bind:this={tooltip} />
    <svg bind:this={svg} />
</div>

<style>
    svg {
        /* background-color: #fff; */
        height: 100%;
        position: fixed;
    }

    .container {
        /* display: flex; */
        justify-content: center;
        height: 100vh; /* for vertical centering */
        position: absolute;
        z-index: 20;
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
