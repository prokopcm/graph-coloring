import type { USMapColoring } from '~/data/mapData'
import { colorNameHex } from '~/data/colors'

export interface GraphNode {
  name: string
  neighbors: string[]
}

/** A record of graph nodes accessible by a string name */
export type KeyedGraph = Record<string, GraphNode>

export interface InvalidNodePairColoring {
  hexColor: string
  nodeId1: string
  nodeId2: string
}

/**
 * Given a graph and a coloring, returns a list of nodes that are neighbors and have the same color.
 * @param props An object with the following properties:
 * @param props.neighborGraph The graph of neighboring nodes
 * @param props.mapColoring The coloring of the graph
 * @param [props.lastUpdatedNodeId] The id of the node that was last updated
 * @returns A list of nodes that are neighbors and have the same color
 */
export function getNeighboringNodesWithSameColor(props: {
  mapColoring: USMapColoring
  neighborGraph: KeyedGraph
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

  if (lastUpdatedNodeId !== undefined) {
    neighboringNodesWithSameColor.sort((nodeInfo) => {
      const nodeIsLastUpdated = nodeInfo.nodeId1 === lastUpdatedNodeId || nodeInfo.nodeId2 === lastUpdatedNodeId

      return nodeIsLastUpdated ? -1 : 1
    })
  }

  return neighboringNodesWithSameColor
}
