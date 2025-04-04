export interface GraphNode {
  name: string
  neighbors: string[]
}

export interface GraphInterface {
  [key: string]: GraphNode
}

export interface NodeWithColor {
  color: string
  name: string
}

/**
 * Returns an array of objects with the name and color of the neighbors of the given state
 * @param graphState The graph node (US state) to get the neighbors of
 * @returns An array of objects with the name and color of the neighbors of the given state
 */
export function getNeighborsWithSameColor (graphState: GraphNode): NodeWithColor[] {
  const coloredStates = graphState.neighbors.map((neighbor) => {
    const stateElement = document.getElementById(graphState.name)
    const neighborElement = document.getElementById(neighbor)
    const stateIsColored = stateElement && stateElement.style.fill !== 'rgb(255, 255, 255)'
    const stateAndNeighborHaveSameColor = stateElement && neighborElement && stateElement.style.fill === neighborElement.style.fill

    if (stateIsColored && stateAndNeighborHaveSameColor) {
      return {
        name: neighbor,
        color: neighborElement.style.fill,
      }
    }

    return null
  }).filter(state => !!state)

  return coloredStates
}

export function getInvalidColoringNodes (graph: GraphInterface): NodeWithColor[] {
  return Object.values(graph)
    .map(graphState => getNeighborsWithSameColor(graphState))
    .filter(Boolean)
    .flat(1)
    .filter((value, index, self) => {
      const sameIndex = self.findIndex(item => item.name === value.name && item.color === value.color) === index

      return sameIndex
    })
    .filter(value => value !== null && value !== undefined)
    .sort((a, b) => {
      const nameA = a.name.toUpperCase()
      const nameB = b.name.toUpperCase()
      if (nameA < nameB)
        return -1
      if (nameA > nameB)
        return 1
      return 0
    })
}
