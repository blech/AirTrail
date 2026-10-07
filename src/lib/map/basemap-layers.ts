import type { LayerSpecification } from 'maplibre-gl';

// Layers added on top of the provider's style by AirTrail itself. They are
// never classified as basemap labels or boundaries, so hiding those keeps the
// airport overlay, OpenAIP and other app layers intact.
const APP_SOURCE_PREFIXES = ['airport-overlay', 'openaip', 'airtrail'] as const;

// OpenMapTiles-schema styles (OpenFreeMap, Carto) use `boundary`; Protomaps
// uses `boundaries`.
const BOUNDARY_SOURCE_LAYERS = new Set(['boundary', 'boundaries']);

type ClassifiableLayer = Pick<LayerSpecification, 'id' | 'type'> & {
  source?: unknown;
  'source-layer'?: unknown;
};

export type BasemapLayerGroups = {
  labels: string[];
  boundaries: string[];
};

const isAppLayer = (layer: ClassifiableLayer) => {
  const source = typeof layer.source === 'string' ? layer.source : '';
  return APP_SOURCE_PREFIXES.some(
    (prefix) => source.startsWith(prefix) || layer.id.startsWith(prefix),
  );
};

export const classifyBasemapLayers = (
  layers: readonly ClassifiableLayer[],
): BasemapLayerGroups => {
  const groups: BasemapLayerGroups = { labels: [], boundaries: [] };

  for (const layer of layers) {
    if (isAppLayer(layer)) continue;

    if (layer.type === 'symbol') {
      groups.labels.push(layer.id);
    } else if (
      typeof layer['source-layer'] === 'string' &&
      BOUNDARY_SOURCE_LAYERS.has(layer['source-layer'])
    ) {
      groups.boundaries.push(layer.id);
    }
  }

  return groups;
};
