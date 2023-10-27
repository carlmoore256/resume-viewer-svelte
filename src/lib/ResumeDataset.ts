import { extent, scaleOrdinal, schemeCategory10 } from "d3";
import { scaleLinear } from "d3-scale";
import type { ScaleLinear, ScaleOrdinal } from "d3-scale";
import type { Description, Experience } from "./api";
import type { DescriptionPoint } from "./chart-types";
import { radius, centerOfMass } from "./points";

export class ResumeDataset {
    private _xScale: ScaleLinear<number, number>;
    private _yScale: ScaleLinear<number, number>;
    private _colorScale: ScaleOrdinal<string, string>;

    private _experiences: Experience[];
    private _descriptions: Description[];

    constructor(
        experiences: Experience[],
        colorRange: ReadonlyArray<string> = schemeCategory10
    ) {
        this._experiences = experiences;
        this._descriptions = experiences.flatMap((e) => e.descriptions);

        const [minX, maxX] = extent(
            this._descriptions.map((d) => d.reducedEmbedding[0])
        );
        const [minY, maxY] = extent(
            this._descriptions.map((d) => d.reducedEmbedding[1])
        );

        this._xScale = scaleLinear().domain([minX!, maxX!]).range([0, 1]);
        this._yScale = scaleLinear().domain([minY!, maxY!]).range([0, 1]);

        const experienceNames = experiences.map((e) => e.name);
        this._colorScale = scaleOrdinal<string>()
            .domain(experienceNames)
            .range(colorRange);
    }

    public get xScale(): ScaleLinear<number, number> {
        return this._xScale;
    }

    public get yScale(): ScaleLinear<number, number> {
        return this._yScale;
    }

    public get colorScale(): ScaleOrdinal<string, string> {
        return this._colorScale;
    }

    public get experiences(): Experience[] {
        return this._experiences;
    }

    public get descriptions(): Description[] {
        return this._descriptions;
    }

    public descriptionCluster(descriptions: Description[]): {
        center: { x: number; y: number };
        radius: number;
    } {
        const x = descriptions.reduce(
            (sum, d) => sum + d.reducedEmbedding[0],
            0
        );
        const y = descriptions.reduce(
            (sum, d) => sum + d.reducedEmbedding[1],
            0
        );

        let r = radius(descriptions.map((d) => d.reducedEmbedding));
        if (!isFinite(r)) r = 0;

        return {
            radius: r,
            center: centerOfMass(descriptions.map((d) => d.reducedEmbedding)),
        };
    }
}
