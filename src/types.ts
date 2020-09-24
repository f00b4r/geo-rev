/**
 * Geocoder configuration options.
 */
export interface Options {
    dataset?: string,
}

/**
 * Single point on the surface of the globe.
 */
export interface Point {
    latitude: number,
    longitude: number,
}

/**
 * Annotated point, typically a town or a city.
 */
export interface GeoRecord extends Point {
    name: string,
    countryCode: string,
}

/**
 * Result of a reverse lookup operation, which is a distance (in km)
 * from a nearest GeoRecord.
 */
export interface LookupResult {
    record: GeoRecord,
    distance: number,
}
