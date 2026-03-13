import type { USMapColoring } from '~/data/mapData'
import { colorNameHex } from '~/data/colors'

/** A pair of nodes in a graph that are neighbors and have the same color */
export interface InvalidNodePairColoring {
  /** The hex color that the two neighboring nodes share */
  hexColor: string

  /** The id of the first node */
  nodeId1: string

  /** The id of the second node */
  nodeId2: string
}

/** A node in a neighbor graph */
export interface NeighborGraphNode {
  /** The id of the node */
  id: string

  /** A list of node ids that the */
  neighbors: string[]
}

/** A record of graph nodes with their neighbors keyed by each node's id */
export type NeighborGraph = Record<string, NeighborGraphNode>

/**
 * Given a graph and a coloring, returns a list of nodes that are neighbors and have the same color.
 * @param props An object with the following properties:
 * @param props.neighborGraph The graph of neighboring nodes
 * @param props.mapColoring The coloring of the graph
 * @param [props.lastUpdatedNodeId] The id of the node that was last updated
 * @returns A list of pairs of nodes that are neighbors and have the same color
 */
export function getNeighboringNodesWithSameColor(props: {
  mapColoring: USMapColoring
  neighborGraph: NeighborGraph
  lastUpdatedNodeId?: string
}): InvalidNodePairColoring[] {
  const { mapColoring, neighborGraph, lastUpdatedNodeId } = props

  const neighboringNodesWithSameColor: InvalidNodePairColoring[] = []

  for (const [nodeId, hexColor] of Object.entries(mapColoring)) {
    const node = neighborGraph[nodeId]

    for (const neighborNodeId of node.neighbors) {
      const neighborColor = mapColoring[neighborNodeId]

      if (neighborColor === hexColor && hexColor !== colorNameHex.BLANK) {
        neighboringNodesWithSameColor.push({
          nodeId1: nodeId,
          nodeId2: neighborNodeId,
          hexColor,
        })
      }
    }
  }

  // Optionally sort the list to put the node that was last updated at the front
  if (lastUpdatedNodeId !== undefined) {
    neighboringNodesWithSameColor.sort(({ nodeId1, nodeId2 }: InvalidNodePairColoring) => {
      const nodeIsLastUpdated = nodeId1 === lastUpdatedNodeId || nodeId2 === lastUpdatedNodeId

      return nodeIsLastUpdated ? -1 : 1
    })
  }

  return neighboringNodesWithSameColor
}
