import type { MapColoring, MapNodeData } from '~/data/mapData'
import { colorNameHex } from '~/data/colors'

/**
 * Initializes a new map coloring object with with all nodes set to the blank color.
 * @param mapData The data for the map.
 * @returns A record with the key the as the node id and the value the hex color of the node.
 */
export function initializeMapColoring(mapData: MapNodeData[]): MapColoring {
  const mapColoring: MapColoring = {}

  for (const node of mapData) {
    mapColoring[node.id] = colorNameHex.BLANK
  }

  return mapColoring
}
