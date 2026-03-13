import type { MapColoring, NeighborGraph } from '../../utils/graphUtils'
import { describe, expect, it } from 'vitest'
import { colorNameHex } from '../../data/colors'
import { getNeighboringNodesWithSameColor } from '../../utils/graphUtils'

describe('getNeighboringNodesWithSameColor', () => {
  it('returns empty array when no neighboring nodes share a color', () => {
    const mapColoring: MapColoring = {
      A: colorNameHex.red,
      B: colorNameHex.blue,
    }

    const neighborGraph: NeighborGraph = {
      A: ['B'],
      B: ['A'],
    }

    const result = getNeighboringNodesWithSameColor({ mapColoring, neighborGraph })

    expect(result).toEqual([])
  })

  it('returns an invalid pair when neighboring nodes share the same non-blank color', () => {
    const mapColoring: MapColoring = {
      A: colorNameHex.red,
      B: colorNameHex.red,
    }

    const neighborGraph: NeighborGraph = {
      A: ['B'],
      B: ['A'],
    }

    const result = getNeighboringNodesWithSameColor({ mapColoring, neighborGraph })

    expect(result).toEqual([
      {
        nodeId1: 'A',
        nodeId2: 'B',
        hexColor: colorNameHex.red,
      },
      {
        nodeId1: 'B',
        nodeId2: 'A',
        hexColor: colorNameHex.red,
      },
    ])
  })

  it('returns an empty array when neighboring nodes are both blank', () => {
    const mapColoring: MapColoring = {
      A: colorNameHex.BLANK,
      B: colorNameHex.BLANK,
    }

    const neighborGraph: NeighborGraph = {
      A: ['B'],
      B: ['A'],
    }

    const result = getNeighboringNodesWithSameColor({ mapColoring, neighborGraph })

    expect(result).toEqual([])
  })

  it('returns an invalid pair when one of multiple neighbors in the matches in color', () => {
    const mapColoring: MapColoring = {
      A: colorNameHex.red,
      B: colorNameHex.blue,
      C: colorNameHex.red,
    }

    const neighborGraph: NeighborGraph = {
      A: ['B', 'C'],
      B: ['A'],
      C: ['A'],
    }

    const result = getNeighboringNodesWithSameColor({ mapColoring, neighborGraph })

    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toMatchObject({
      nodeId1: 'A',
      nodeId2: 'C',
      hexColor: colorNameHex.red,
    })
  })

  it('sorts results so pairs involving lastUpdatedNodeId come first', () => {
    const mapColoring: MapColoring = {
      A: colorNameHex.red,
      B: colorNameHex.red,
      C: colorNameHex.blue,
      D: colorNameHex.blue,
    }

    const neighborGraph: NeighborGraph = {
      A: ['B'],
      B: ['A'],
      C: ['D'],
      D: ['C'],
    }

    const result = getNeighboringNodesWithSameColor({
      mapColoring,
      neighborGraph,
      lastUpdatedNodeId: 'C',
    })

    expect(result).toHaveLength(4)
    const firstTwo = result.slice(0, 2)
    const lastTwo = result.slice(2, 4)
    for (const pair of firstTwo) {
      expect(pair.nodeId1 === 'C' || pair.nodeId2 === 'C').toBe(true)
    }
    for (const pair of lastTwo) {
      expect(pair.nodeId1 === 'C' || pair.nodeId2 === 'C').toBe(false)
    }
  })
})
