import { extent, scaleOrdinal, schemeCategory10 } from "d3";
import type { ScaleLinear, ScaleOrdinal } from "d3-scale";
import { scaleLinear } from "d3-scale";
import type { Description, Experience, ResumeData, Skill } from "./api-types";
import { centerOfMass, coordsToPonts, raidusCoords } from "./points";

export class ResumeDataset {
    private _xScale: ScaleLinear<number, number>;
    private _yScale: ScaleLinear<number, number>;
    private _colorScale: ScaleOrdinal<string, string>;

    private _resumeData: ResumeData;

    // private _experiences: Experience[];
    // private _descriptions: Description[];

    private _descriptionPositions: Map<Description, { x: number; y: number }>;

    private _descriptionPositionX = (d: Description) => d.reducedEmbedding[0];
    private _descriptionPositionY = (d: Description) => d.reducedEmbedding[1];

    constructor(
        resumeData: ResumeData,
        rangeX: [number, number] = [0, 1],
        rangeY: [number, number] = [0, 1],
        descriptionPositionX?: (d: Description) => number,
        descriptionPositionY?: (d: Description) => number,
        colorRange: ReadonlyArray<string> = schemeCategory10
    ) {
        console.log(`Creating ResumeDataset`);
        this._resumeData = resumeData;
        // this._descriptions = experiences.flatMap((e) => e.descriptions);

        this._descriptionPositionX =
            descriptionPositionX || this._descriptionPositionX;
        this._descriptionPositionY =
            descriptionPositionY || this._descriptionPositionY;

        this._descriptionPositions = new Map(
            this._resumeData.descriptions.map((d) => [
                d,
                {
                    x: this._descriptionPositionX(d),
                    y: this._descriptionPositionY(d),
                },
            ])
        );

        const [minX, maxX] = extent(
            this._resumeData.descriptions.map((d) => this._descriptionPositions.get(d)!.x)
        );
        const [minY, maxY] = extent(
            this._resumeData.descriptions.map((d) => this._descriptionPositions.get(d)!.y)
        );

        this._xScale = scaleLinear().domain([minX!, maxX!]).range(rangeX);
        this._yScale = scaleLinear().domain([minY!, maxY!]).range(rangeY);

        const experienceNames = this._resumeData.experiences.map((e) => e.name);
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
        return this._resumeData.experiences;
    }

    public get descriptions(): Description[] {
        return this._resumeData.descriptions;
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

    public descriptionsForExperience(experience: Experience): Description[] {
        return this._resumeData.joins.experiences
            .find(e => e.experienceId === experience.id)!
            .descriptionIds.map(dId => this._resumeData.descriptions.find(d => d.id === dId)!);
    }

    public skillsForExperience(experience: Experience): Skill[] {
        return this._resumeData.joins.experiences
            .find(e => e.experienceId === experience.id)!
            .skillIds.map(sId => this._resumeData.skills.find(s => s.id === sId)!);
    }

    public skillsForDescription(description: Description): Skill[] {
        return this._resumeData.joins.descriptions
            .find(d => d.descriptionId === description.id)!
            .skillIds.map(sId => this._resumeData.skills.find(s => s.id === sId)!);
    }

    public experienceForDescription(description: Description): Experience {
        return this._resumeData.experiences
            .find(e => e.id === this._resumeData.joins.experiences
                .find(j => j.descriptionIds.includes(description.id))!.experienceId)!;
    }


    public experiencePosition(experience: Experience) {
        // const { descriptions } = experience;

        const descriptions = this.descriptionsForExperience(experience);
        return centerOfMass(
            coordsToPonts(descriptions.map((d) => this.descriptionPosition(d)))
        );
    }

    public experienceRadius(experience: Experience) {
        const descriptions = this.descriptionsForExperience(experience);
        let r = raidusCoords(
            descriptions.map((d) => this.descriptionPosition(d))
        );
        if (!isFinite(r)) r = 0;
        return r;
    }

    public experienceColor(experience: Experience): string {
        return this._colorScale(experience.name);
    }

    public descriptionsWithSkill(skillId: string): Description[] {
        const descriptions: Description[] = [];
        for (const join of this._resumeData.joins.descriptions) {
            if (join.skillIds.includes(skillId)) {
                descriptions.push(this._resumeData.descriptions.find(d => d.id === join.descriptionId)!);
            }
        }
        return descriptions;
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
        const experience = this.experienceForDescription(description);
        return this._colorScale(experience!.name);
    }

    public descriptionExperience(description: Description): Experience {
        const { experienceId } = this._resumeData.joins.experiences.find(e => e.descriptionIds.includes(description.id))!;
        return this._resumeData.experiences.find(e => e.id === experienceId)!;
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
