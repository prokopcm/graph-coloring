<script setup lang="ts">
/**
 * A component that displays an SVG map with coloring state and handles
 * the input events for the map.
 */
import type { MapColoring, MapNodeData } from '~/data/mapData'
import { colorNameHex } from '~/data/colors'

const props = defineProps<{
  mapData: MapNodeData[]
  mapColoring: MapColoring
  highlightedNodeId: string | null
  selectedNodeId: string | null
}>()

const emit = defineEmits<{
  (e: 'emptyClicked'): void
  (e: 'nodeClicked', payload: { nodeId: string, element: HTMLElement, clientX: number, clientY: number }): void
  (e: 'nodeHovered', payload: { nodeId: string }): void
  (e: 'mouseenterNode', payload: { nodeId: string, element: HTMLElement }): void
  (e: 'mouseoutNode', payload: { nodeId: string, element: HTMLElement }): void
}>()

/**
 * Returns the fill color for a given node (state) based on the selected state and mouseover state.
 * @param stateId The ID of the state to get the fill color for, e.g. `'CA'`.
 * @returns The hex fill color to apply to the given node, e.g. `'#FF0000'`.
 */
function getFillColorForNode(nodeId: string) {
  if (props.selectedNodeId) {
    if (props.selectedNodeId === nodeId) {
      return colorNameHex.SELECTED
    }
  }
  if (props.highlightedNodeId && props.highlightedNodeId === nodeId) {
    return colorNameHex.HIGHLIGHTED
  }

  return props.mapColoring[nodeId] || colorNameHex.BLANK
}

/**
 * Handles the mouse entering a node path and emits the mouseenterNode event
 * if the node is uncolored.
 * @param event The mouse enter event.
 */
function onMouseEnterNode(event: MouseEvent) {
  const nodeElement = event.target as HTMLElement

  if (
    nodeElement.tagName === 'path'
    && nodeElement.id
    && props.mapColoring[nodeElement.id] === colorNameHex.BLANK
  ) {
    emit('mouseenterNode', { nodeId: nodeElement.id, element: nodeElement })
  }
}

/**
 * Handles the mouse leaving a node path and emits the mouseoutNode event.
 * @param event The mouse leave event.
 */
function onMouseOutNode(event: MouseEvent) {
  const nodeElement = event.target as HTMLElement

  if (nodeElement.tagName === 'path' && nodeElement.id) {
    emit('mouseoutNode', { nodeId: nodeElement.id, element: nodeElement })
  }
}

/**
 * Handles something in the SVG being clicked on the map.
 * If a node path was clicked, it emits the nodeClicked event.
 * Otherwise, it emits the emptyClicked event.
 * @param event The click or tap event.
 */
function onNodeClicked(event: PointerEvent) {
  const nodeElement = event.target as HTMLElement

  if (nodeElement.tagName === 'path' && nodeElement.id) {
    emit('nodeClicked', {
      nodeId: nodeElement.id,
      element: nodeElement,
      clientX: event.clientX,
      clientY: event.clientY,
    })
  }
  else {
    emit('emptyClicked')
  }
}
</script>

<template>
  <div class="relative">
    <svg
      class="svg-map"
      xmlns="http://www.w3.org/2000/svg"
      style="stroke-linejoin: round; stroke: #000; fill: none; cursor: pointer;"
      @click.prevent="onNodeClicked"
    >
      <path
        v-for="state in mapData"
        :id="state.id"
        :key="state.id"
        :d="state.d"
        :style="{ fill: getFillColorForNode(state.id) }"
        @mouseenter="onMouseEnterNode"
        @mouseout="onMouseOutNode"
      />
    </svg>
  </div>
</template>

<style scoped>
.svg-map {
  width: 1000px;
  height: 589px;
  display: inline-block;
}
</style>
