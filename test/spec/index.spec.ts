import { createRevGeocoder } from '../../dist';

test('lookup a single point using complete dataset', async () => {
    const point = {latitude: 50.652576, longitude: 13.723918};

    const result = (await createRevGeocoder()).lookup(point);

    expect(result.record.name).toBe('Hrob');
    expect(result.record.countryCode).toBe('CZ');
    expect(result.record.latitude).toBeCloseTo(50.65919, 5);
    expect(result.record.longitude).toBeCloseTo(13.72676, 5);
    expect(result.distance).toBeCloseTo(0.7622437751065233, 5);
});
