/**
 * Geo-Rev by stuchl4n3k
 *
 * Simple reverse geocoder based on GeoNames.org dataset and a K-D tree index for fast lookup.
 *
 * @packageDocumentation
 */

import { createReadStream } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';
import { once } from 'events';
import createKDTree = require('static-kdtree');
import { GeoRecord, LookupResult, Options, Point } from './types';
export * from './types';

/**
 * Creates a new RevGeocoder instance and runs its initialization using given options.
 * @param options Options to configure the RevGeocoder with
 */
export async function createRevGeocoder(options?: Options): Promise<RevGeocoder> {
    return new RevGeocoder(options).init();
}

/**
 * Main class for reverse geocoding.
 */
export class RevGeocoder {

    private readonly dataset: string;
    private records: GeoRecord[] = [];
    private index?: KDTree;

    /**
     * Creates a new RevGeocoder instance using given options.
     *
     * The instance then needs to be initialized using `RevGeocoder.init()`.
     *
     * @param options Options to configure the RevGeocoder with
     */
    constructor(options?: Options) {
        options = options || {};
        options.dataset = options.dataset || join(__dirname, '..', 'data', 'cities500.csv');

        this.dataset = options.dataset;
    }

    /**
     * Initializes this instance: loads geo-records from the dataset file and builds an index.
     */
    public async init(): Promise<RevGeocoder> {
        this.records = await parseDataset(this.dataset);
        this.index = createIndex(this.records);
        return this;
    }

    /**
     * Looks up a nearest GeoRecord for a given point.
     *
     * @param point A point to lookup in the index.
     */
    public lookup(point: Point): LookupResult {
        if (!this.index) {
            throw new Error('Index not initialized.');
        }

        const nearestRecordIndex = this.index.nn([point.latitude, point.longitude]);
        if (nearestRecordIndex < 0 || nearestRecordIndex >= this.records.length) {
            // As long as the records don't mutate, this shouldn't happen.
            throw new Error('Record index out of bounds.');
        }

        return {
            record: this.records[nearestRecordIndex],
            distance: distanceBetween(point, this.records[nearestRecordIndex]),
        };
    }
}

/**
 * Parses a given CSV file to a list of GeoRecords.
 */
async function parseDataset(dataset: string): Promise<GeoRecord[]> {
    const records: GeoRecord[] = [];
    const reader = createInterface({
        input: createReadStream(dataset),
        historySize: 0,
        crlfDelay: Infinity,
    });

    reader.on('line', line => records.push(parseLine(line)));
    await once(reader, 'close');

    return records;
}

/**
 * Parses a given CSV line to a GeoRecord.
 */
function parseLine(line: string): GeoRecord {
    const cols = line.split(';');
    return {
        name: cols[0],
        latitude: parseFloat(cols[1]),
        longitude: parseFloat(cols[2]),
        countryCode: cols[3],
    };
}

/**
 * Creates a spatial (K-D Tree) index using given records.
 */
function createIndex(records: GeoRecord[]): KDTree {
    return createKDTree(records.map(record => [record.latitude, record.longitude]));
}

/**
 * Distance function for 2 points on the globe.
 * Source: http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @return Distance between the given points in kilometers
 */
function distanceBetween(x: Point, y: Point): number {
    const lat1 = x.latitude;
    const lon1 = x.longitude;
    const lat2 = y.latitude;
    const lon2 = y.longitude;

    const R = 6371;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Converts given andle in degrees to radians.
 */
function toRad(deg: number): number {
    return deg * Math.PI / 180;
}
