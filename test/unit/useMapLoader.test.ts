import type { MapNodeData } from '../../utils/mapUtils'
import { describe, expect, it } from 'vitest'
import useMapDataLoader from '../../composables/useMapDataLoader'

describe('useMapDataLoader', () => {
  it('builds neighborGraph, nodeIdToName, nodeIds, and idealColoring from map data', () => {
    const mapData: MapNodeData[] = [
      {
        id: 'AL',
        name: 'Alabama',
        d: 'svgAL',
        neighbors: ['LA'],
        idealColor: 'c1',
      },
      {
        id: 'LA',
        name: 'Louisiana',
        d: 'svgLA',
        neighbors: ['AL'],
        idealColor: 'c2',
      },
    ]

    const { neighborGraph, nodeIdToName, nodeIds, idealColoring } = useMapDataLoader(mapData)

    expect(neighborGraph).toEqual({
      AL: ['LA'],
      LA: ['AL'],
    })
    expect(nodeIdToName).toEqual({
      AL: 'Alabama',
      LA: 'Louisiana',
    })
    expect(nodeIds).toEqual(['AL', 'LA'])
    expect(idealColoring).toEqual({
      AL: 'c1',
      LA: 'c2',
    })
  })

  it('handles empty map data', () => {
    const { neighborGraph, nodeIdToName, nodeIds, idealColoring } = useMapDataLoader([])

    expect(neighborGraph).toEqual({})
    expect(nodeIdToName).toEqual({})
    expect(nodeIds).toEqual([])
    expect(idealColoring).toEqual({})
  })

  it('includes all neighbors and preserves nodeIds order for larger maps', () => {
    const mapData: MapNodeData[] = [
      {
        id: 'ID',
        name: 'Idaho',
        d: 'svgID',
        neighbors: ['OR', 'WA'],
        idealColor: 'c1',
      },
      {
        id: 'OR',
        name: 'Oregon',
        d: 'svgOR',
        neighbors: ['ID', 'WA'],
        idealColor: 'c2',
      },
      {
        id: 'WA',
        name: 'Washington',
        d: 'svgWA',
        neighbors: ['ID', 'OR'],
        idealColor: 'c3',
      },
    ]

    const { neighborGraph, nodeIdToName, nodeIds, idealColoring } = useMapDataLoader(mapData)

    expect(neighborGraph).toEqual({
      ID: ['OR', 'WA'],
      OR: ['ID', 'WA'],
      WA: ['ID', 'OR'],
    })
    expect(nodeIdToName).toEqual({
      ID: 'Idaho',
      OR: 'Oregon',
      WA: 'Washington',
    })
    expect(nodeIds).toEqual(['ID', 'OR', 'WA'])
    expect(idealColoring).toEqual({
      ID: 'c1',
      OR: 'c2',
      WA: 'c3',
    })
  })
})
