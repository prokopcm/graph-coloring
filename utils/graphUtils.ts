export interface GraphNode {
  name: string
  neighbors: string[]
}

export interface GraphInterface {
  [key: string]: GraphNode
}
