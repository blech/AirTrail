import { describe, expect, it } from 'vitest';

import { classifyBasemapLayers } from './basemap-layers';

describe('classifyBasemapLayers', () => {
  it('finds basemap labels and boundaries across provider schemas', () => {
    const groups = classifyBasemapLayers([
      { id: 'water', type: 'fill', source: 'openmaptiles' },
      { id: 'place_country', type: 'symbol', source: 'openmaptiles' },
      {
        id: 'boundary_country',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'boundary',
      },
      {
        id: 'boundaries_country',
        type: 'line',
        source: 'protomaps',
        'source-layer': 'boundaries',
      },
      {
        id: 'roads',
        type: 'line',
        source: 'protomaps',
        'source-layer': 'roads',
      },
    ]);

    expect(groups.labels).toEqual(['place_country']);
    expect(groups.boundaries).toEqual([
      'boundary_country',
      'boundaries_country',
    ]);
  });

  it('leaves AirTrail-owned layers alone', () => {
    const groups = classifyBasemapLayers([
      {
        id: 'airport-overlay-name-label',
        type: 'symbol',
        source: 'airport-overlay',
      },
      {
        id: 'openaip-airports-label',
        type: 'symbol',
        source: 'openaip-airports',
      },
      {
        id: 'airtrail-time-of-day-night',
        type: 'fill',
        source: 'airtrail-time-of-day-source',
      },
    ]);

    expect(groups).toEqual({ labels: [], boundaries: [] });
  });
});
