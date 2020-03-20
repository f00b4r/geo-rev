/**
 * Geocoder configuration options.
 */
interface Options {
  dataset?: string,
}

/**
 * Single point on the surface of the globe.
 */
interface Point {
  latitude: number,
  longitude: number,
}

/**
 * Annotated point, typically a town or a city.
 */
interface GeoRecord extends Point {
  name: string,
  countryCode: string,
}

/**
 * Result of a reverse lookup operation, which is a distance (in km)
 * from a nearest GeoRecord.
 */
interface LookupResult {
  record: GeoRecord,
  distance: number,
}
