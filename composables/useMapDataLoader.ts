/**
 * Composable with functions that make working with map data more convenient and performant.
 */
import type { AbstractMapColoring, MapColoring, NeighborGraph } from '~/utils/graphUtils'
import type { MapNodeData } from '~/utils/mapUtils'
import { colorNameHex } from '~/data/colors'

export default function (mapData: MapNodeData[]) {
  /** A dict of a node id as the key and a list of which node ids it has edges with/neighbors */
  const neighborGraph: NeighborGraph = {}

  /** A record with the node id as the key the and the hex color of the node as the value. */
  const mapColoring: MapColoring = {}

  /** A record of node id to the node's display name */
  const nodeIdToName: Record<string, string> = {}

  /** A list of the node ids in a map */
  const nodeIds: string[] = []

  /**
   * A record with a key of a node id and a value of an AbstractColor
   * representing an ideal or at least valid coloring of the map the
   * nodes constitute.
   */
  const idealColoring: AbstractMapColoring = {}

  for (const node of mapData) {
    neighborGraph[node.id] = node.neighbors
    mapColoring[node.id] = colorNameHex.BLANK
    nodeIds.push(node.id)
    nodeIdToName[node.id] = node.name
    idealColoring[node.id] = node.idealColor
  }

  /**
   * Returns the human-readable display name of a node.
   * @param nodeId The id of the node to get the display name for.
   * @returns The display name of the node, or an empty string if the node id is invalid.
   */
  function getNodeDisplayName(nodeId?: string) {
    if (nodeId === undefined) {
      return ''
    }

    return nodeIdToName[nodeId] ?? ''
  }

  return {
    getNodeDisplayName,
    neighborGraph,
    nodeIdToName,
    nodeIds,
    idealColoring,
  }
}
