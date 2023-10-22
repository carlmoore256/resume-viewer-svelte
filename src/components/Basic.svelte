<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";

    function parseNumber(str: string) {
        return +str.replace(/,/g, "");
    }

    function transformNumericData(data: any[]) {
        function parseNumber(str: string) {
            if (typeof str !== "string") return str; // Return as-is if not a string
            const parsed = +str.replace(/,/g, ""); // Remove commas and try converting
            return isNaN(parsed) ? str : parsed; // Return original string if NaN
        }

        return data.map((item: any) => {
            const transformedItem: any = {};
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    transformedItem[key] = parseNumber(item[key]);
                }
            }
            return transformedItem;
        });
    }


    let data: any;

    function generateBarchart(chartData: any) {
        const width = document.querySelector("body")!.clientWidth;
        const height = 500;

        const svg = d3
            .select("#svg")
            .attr("width", width)
            .attr("height", height);

        // clear the svg
        svg.selectAll("*").remove();

        svg.attr("viewBox", [0, 0, width, height]);

        const margin = { top: 20, right: 30, bottom: 55, left: 70 };

        const xScale = d3
            .scaleBand()
            .domain(chartData.map((d) => d.state))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(chartData, (d) => d.total)])
            .range([height - margin.bottom, margin.top]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.selectAll("rect")
            .data(chartData)
            .join("rect")
            .attr("x", (d) => xScale(d.state))
            .attr("y", (d) => yScale(d.total))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => yScale(0) - yScale(d.total));

        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis)
            .selectAll("text") // everything from this point is optional
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // add y axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis);
    }

    onMount(() => {
        d3.csv("2020-election-states.csv").then((_data) => {
            data = transformNumericData(_data);
        });
    });

    $: if (data) {
        generateBarchart(data);
    }
</script>

<svelte:window on:resize={() => generateBarchart(data)} />

<svg id="svg" />

<style>
    #svg {
        background-color: #eeeeee50;
        margin: 0;
        padding: 0;
    }
</style>
