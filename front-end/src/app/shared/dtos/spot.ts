export class Spot {
    submittedBy: string;
    isPrivate: boolean;
    geoJson: string;
    hashKey: number;
    rangeKey: string;
    rating: number;
    spotName: string;
    point: any;
    spotType: string;
    constructor(data: object) {
        Object.assign(this, data);
    }
}
