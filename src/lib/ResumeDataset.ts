import { extent, scaleOrdinal, schemeCategory10 } from "d3";
import { scaleLinear } from "d3-scale";
import type { ScaleLinear, ScaleOrdinal } from "d3-scale";
import type { Description, Experience } from "./api";
import type { DescriptionPoint } from "./types/chart-types";
import { radius, raidusCoords, centerOfMass, coordsToPonts } from "./points";

export class ResumeDataset {
    private _xScale: ScaleLinear<number, number>;
    private _yScale: ScaleLinear<number, number>;
    private _colorScale: ScaleOrdinal<string, string>;

    private _experiences: Experience[];
    private _descriptions: Description[];

    private _descriptionPositions: Map<Description, { x: number; y: number }>;

    private _descriptionPositionX = (d: Description) => d.reducedEmbedding[0];
    private _descriptionPositionY = (d: Description) => d.reducedEmbedding[1];

    constructor(
        experiences: Experience[],
        rangeX: [number, number] = [0, 1],
        rangeY: [number, number] = [0, 1],
        descriptionPositionX?: (d: Description) => number,
        descriptionPositionY?: (d: Description) => number,
        colorRange: ReadonlyArray<string> = schemeCategory10
    ) {
        console.log(`Creating ResumeDataset`);
        this._experiences = experiences;
        this._descriptions = experiences.flatMap((e) => e.descriptions);

        this._descriptionPositionX =
            descriptionPositionX || this._descriptionPositionX;
        this._descriptionPositionY =
            descriptionPositionY || this._descriptionPositionY;

        this._descriptionPositions = new Map(
            this._descriptions.map((d) => [
                d,
                {
                    x: this._descriptionPositionX(d),
                    y: this._descriptionPositionY(d),
                },
            ])
        );

        const [minX, maxX] = extent(
            this._descriptions.map((d) => this._descriptionPositions.get(d)!.x)
        );
        const [minY, maxY] = extent(
            this._descriptions.map((d) => this._descriptionPositions.get(d)!.y)
        );

        this._xScale = scaleLinear().domain([minX!, maxX!]).range(rangeX);
        this._yScale = scaleLinear().domain([minY!, maxY!]).range(rangeY);

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

    // public descriptionCluster(descriptions: Description[]): {
    //     center: { x: number; y: number };
    //     radius: number;
    // } {
    //     let r = raidusCoords(
    //         descriptions.map((d) => this.descriptionPosition(d))
    //     );
    //     if (!isFinite(r)) r = 0;

    //     return {
    //         radius: r,
    //         center: centerOfMass(descriptions.map((d) => d.reducedEmbedding)),
    //     };
    // }

    public experiencePosition(experience: Experience) {
        const { descriptions } = experience;
        return centerOfMass(
            coordsToPonts(descriptions.map((d) => this.descriptionPosition(d)))
        );
    }

    public experienceRadius(experience: Experience) {
        const { descriptions } = experience;
        let r =raidusCoords(
            descriptions.map((d) => this.descriptionPosition(d))
        );
        if (!isFinite(r)) r = 0; 
        return r;
    }

    public experienceColor(experience: Experience): string {
        return this._colorScale(experience.name);
    }

    public descriptionsWithSkill(skillId: string): Description[] {
        return this._descriptions.filter((d) => d.skillIds.includes(skillId));
    }

    public lineBetweenDescriptions(
        descriptionA: Description,
        descriptionB: Description
    ) {
        const xStart = this._descriptionPositions.get(descriptionA)!.x;
        const yStart = this._descriptionPositions.get(descriptionA)!.y;
        const xEnd = this._descriptionPositions.get(descriptionB)!.x;
        const yEnd = this._descriptionPositions.get(descriptionB)!.y;
        const x1 = this._xScale(xStart);
        const y1 = this._yScale(yStart);
        const x2 = this._xScale(xEnd);
        const y2 = this._yScale(yEnd);
        return { x1, y1, x2, y2 };
    }

    public descriptionColor(description: Description): string {
        const experience = this._experiences.find((e) =>
            e.descriptions.includes(description)
        );
        return this._colorScale(experience!.name);
    }

    public descriptionExperience(description: Description): Experience {
        return this._experiences.find((e) =>
            e.descriptions.includes(description)
        )!;
    }

    public descriptionPosition(description: Description): {
        x: number;
        y: number;
    } {
        return {
            x: this._xScale(this._descriptionPositionX(description)),
            y: this._yScale(this._descriptionPositionY(description)),
        };
    }
}
