export class SpotUtilities {
    // return distance in meters
    // fuck ya math!
    public static getDistance(origin: Array<number>, destination: Array<number>) {
        const lon1 = this.toRadian(origin[0]),
            lat1 = this.toRadian(origin[1]),
            lon2 = this.toRadian(destination[0]),
            lat2 = this.toRadian(destination[1]);

        const deltaLat = lat2 - lat1;
        const deltaLon = lon2 - lon1;

        const a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
        const c = 2 * Math.asin(Math.sqrt(a));
        const EARTH_RADIUS = 6371;
        const b =  c * EARTH_RADIUS * 1000;
        return b;
    }

    public static toRadian(degree: number) {
        return degree * Math.PI / 180;
    }

    public static toMiles(meters: number) {
        return (meters * 0.000621371192).toFixed(2);
    }
}
