import type { AbstractNodeColor } from '~/utils/graphUtils'
import { colorNameHex } from '~/data/colors'

/** A record with the key the as the node id and the value the hex color of the node */
export interface MapColoring {
  [key: string]: string
}

export interface MapNodeData {
  /** The SVG path data for the node's shape */
  d: string

  /** The id of the node */
  id: string

  /** The ideal color for the node */
  idealColor: AbstractNodeColor

  /** The human-readable display name of the node */
  name: string
}

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
