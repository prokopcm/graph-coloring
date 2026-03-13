<script setup lang="ts">
/**
 * A component that displays an SVG map and provides tools to help a user color
 * regions of the map.
 */
import type { MapColoring } from '~/data/mapData'
import confetti from 'canvas-confetti'
import { computed, onMounted, ref, watch } from 'vue'
import AdminButton from '~/components/AdminButton.vue'
import ColorPicker from '~/components/ColorPicker.vue'
import InvalidColoringMessage from '~/components/InvalidColoringMessage.vue'
import MapButtonControls from '~/components/MapButtonControls.vue'
import MapCompleteMessage from '~/components/MapCompleteMessage.vue'
import MapViewer from '~/components/MapViewer.vue'
import UncoloredNodeHelperWidget from '~/components/UncoloredNodeHelperWidget.vue'
import { colorNameHex, colorsList } from '~/data/colors'
import { adjacentNeighbors, idealColoring, mapData, nodeIdToName } from '~/data/mapData'
import { colorToName } from '~/utils/colorUtils'
import { isSciFest, TWO_MIN_MS } from '~/utils/dateTimeUtils'
import { getNeighboringNodesWithSameColor } from '~/utils/graphUtils'
import { initializeMapColoring } from '~/utils/mapUtils'

/** Whether the admin mode is enabled. Disables reset timers. */
const adminMode = ref(false)

/** The y position the color picker should be displayed at */
const colorPickerX = ref(0)

/** The y position the color picker should be displayed at */
const colorPickerY = ref(0)

/** The id of the timeout for the interaction timer */
const interactionTimerId = ref<number | null>(null)

/** A record with the key the state id and the value the hex color of the state */
const mapColoring = ref<MapColoring>(initializeMapColoring(mapData))

/** The node id that the mouse is hovering over */
const mouseoverNodeId = ref<string | null>(null)

/** A list of pairs of nodes that are neighbors and have the same color */
const nodesWithInvalidColorings = ref<InvalidNodePairColoring[]>([])

/** The id of the timeout for the reset timer */
const resetTimerId = ref<number | null>(null)

/** The node id of the state/node that is selected */
const selectedNodeEl = ref<HTMLElement | null>(null)

/** Whether to show the color picker */
const showColorPicker = ref(false)

/** Whether to show the are you still there dialog */
const showAreYouStillThereDialog = ref(false)

/** Whether to show the info dialog */
const showInfoDialog = ref(false)

/** Whether to show the success message */
const showSuccessMessage = ref(false)

/** A ref to the uncolored node helper widget */
const uncoloredNodeHelperRef = ref<InstanceType<typeof UncoloredNodeHelperWidget> | null>(null)

/** The number of unique colors used to color the map */
const colorsUsed = computed(() => {
  const used = new Set(Object.values(mapColoring.value).filter(color => color !== colorNameHex.BLANK))

  return used.size
})

/** A list of the state ids that are still uncolored */
const uncoloredNodes = computed(() => {
  const uncolored = Object.entries(mapColoring.value)
    .filter(([_, color]) => color === colorNameHex.BLANK)
    .map(([state, _]) => state)

  return uncolored.sort((a, b) => nodeIdToName[a] < nodeIdToName[b] ? -1 : 1)
})

const completedMap = computed(() => {
  return uncoloredNodes.value.length === 0 && nodesWithInvalidColorings.value.length === 0
})

// Watch for map fully colored and in a valid state
watch(completedMap, (completed) => {
  if (completed) {
    celebrateColoringCompletion()
  }
})

watch(() => uncoloredNodeHelperRef.value?.hoveredNodeId ?? null, (hoveredId) => {
  if (hoveredId && typeof hoveredId !== 'string') {
    return
  }

  if (!hoveredId || typeof hoveredId !== 'string') {
    mouseoverNodeId.value = null

    return
  }

  if (mapColoring.value[hoveredId] !== colorNameHex.BLANK) {
    mouseoverNodeId.value = null

    return
  }

  const stateElement = document.getElementById(hoveredId) as HTMLElement | null

  if (stateElement && stateElement.tagName === 'path') {
    mouseoverNodeId.value = hoveredId
  }
})

/**
 * Clears the interaction timer if it is set.
 */
function cancelInteractionTimer() {
  if (interactionTimerId.value) {
    clearTimeout(interactionTimerId.value)
    interactionTimerId.value = null
  }
}

/**
 * Clears the map reset timer if it is set.
 */
function cancelResetTimer() {
  if (resetTimerId.value) {
    clearTimeout(resetTimerId.value)
    resetTimerId.value = null
  }
}

/**
 * Shows the success message and confetti to the user after they have completed the coloring.
 * Also starts the reset timer if it is currently SciFest and not in admin mode.
 */
function celebrateColoringCompletion() {
  showSuccessMessage.value = true

  confetti({
    particleCount: 300,
    spread: 70,
    origin: { x: 0.5, y: 0.5 },
    zIndex: 0,
  })

  if (isSciFest && !adminMode.value) {
    startResetTimer()
  }
}

/**
 * Closes all open dialogs/modals and resets the interaction timer.
 */
function closeDialogs() {
  toggleInfoDialog(false)
  toggleAreYouStillThereDialog(false)

  resetInteractionTimer()
}

/**
 * Handles the mouse entering a state/node and sets the mouseoverNodeId
 * to the state element if it is uncolored.
 * @param event The mouse enter event.
 */
function onMouseEnterNode(payload: { nodeId: string, element: HTMLElement }) {
  if (payload.element.id && mapColoring.value[payload.element.id] === colorNameHex.BLANK) {
    mouseoverNodeId.value = payload.nodeId
  }
}

/**
 * Handles the mouse leaving a state/node and resets the mouseoverNodeId.
 * @param event The mouse leave event.
 */
function onMouseOutNode(payload: { nodeId: string, element: HTMLElement }) {
  if (payload.element.tagName === 'path' && payload.element.id) {
    if (selectedNodeEl.value && selectedNodeEl.value.id === payload.nodeId) {
      return
    }

    mouseoverNodeId.value = null
  }
}

/**
 * Toggles the admin mode.
 */
function onToggleAdmin() {
  adminMode.value = !adminMode.value
}

/**
 * Sets the color of the selected node (state) to a given hex color after a user
 * has selected a color from the color picker.
 * Also hides the color picker and resets the reset and interaction timers.
 * @param color The hex color to set the node to, e.g. `'#FF0000'`.
 */
function onColorPickerColorSelected(hexColor: string) {
  resetInteractionTimers()

  if (selectedNodeEl.value) {
    setSelectedNodeColor(hexColor)
  }

  toggleColorPicker(false)

  nodesWithInvalidColorings.value = getNeighboringNodesWithSameColor({
    mapColoring: mapColoring.value,
    neighborGraph: adjacentNeighbors,
    lastUpdatedNodeId: selectedNodeEl?.value?.id,
  })
}

/**
 * Handles the map wrapper being clicked or tapped and hides the color picker.
 * @param event The click or tap event.
 */
function onMapWrapperClicked(event: PointerEvent) {
  if (event.target instanceof HTMLElement && event.target.id === 'map-wrapper') {
    toggleColorPicker(false)
  }
}

/**
 * Handles a state being clicked on the map.
 * @param event The click or tap event.
 */
function onNodeClicked(payload?: { nodeId: string, element: HTMLElement, clientX: number, clientY: number }) {
  if (!payload) {
    toggleColorPicker(false)
    return
  }

  if (payload.element.tagName === 'path' && payload.element.id) {
    // get page width
    const mapWrapper = document.querySelector('.map-wrapper') as HTMLElement
    const pageWidth = mapWrapper.offsetWidth

    colorPickerX.value = Math.min(payload.clientX - 150, pageWidth - 420)
    colorPickerY.value = payload.clientY + 10
    selectedNodeEl.value = payload.element

    toggleColorPicker(true)
  }
}

/**
 * Handles the reset button being clicked and resets the graph.
 */
function onResetButtonClicked() {
  resetMapColors()
}

/**
 * Opens the info dialog.
 */
function openInfoDialog() {
  toggleInfoDialog(true)
  resetInteractionTimer()
}

/**
 * Cancels and resets the interaction and reset timers.
 */
function resetInteractionTimers() {
  cancelInteractionTimer()
  cancelResetTimer()
}

function resetInteractionTimer() {
  cancelInteractionTimer()

  if (uncoloredNodes.value.length === 50 || !isSciFest || adminMode.value) {
    return
  }

  interactionTimerId.value = setTimeout(() => {
    interactionTimerId.value = null
    toggleAreYouStillThereDialog(true)
    startResetTimer()
  }, TWO_MIN_MS)
}

/**
 * Resets the state colors to blank and closes all dialogs.
 * Also resets the interaction timers.
 */
function resetMapColors() {
  resetInteractionTimers()

  closeDialogs()

  for (const state in mapColoring.value) {
    mapColoring.value[state] = colorNameHex.BLANK
  }

  selectedNodeEl.value = null
  mouseoverNodeId.value = null
  showColorPicker.value = false
  showSuccessMessage.value = false

  nodesWithInvalidColorings.value = []
}

/**
 * Selects a state on the map. Resets interaction timers,
 * sets the SVG graphic's fill color for the state, and opens the color picker.
 * @param stateId The ID of the state to select, e.g. `'CA'`.
 */
function selectState(stateId: string) {
  resetInteractionTimers()

  const stateElement = document.getElementById(stateId) as HTMLElement

  if (stateElement && stateElement.tagName === 'path') {
    // Position the color picker near the state element
    const rect = stateElement.getBoundingClientRect()
    const mapWrapper = document.querySelector('.map-wrapper') as HTMLElement
    const pageWidth = mapWrapper.offsetWidth

    colorPickerX.value = Math.min(rect.left, pageWidth - 420)
    colorPickerY.value = rect.bottom

    selectedNodeEl.value = stateElement
    toggleColorPicker(true)
  }
}

/**
 * Auto-colors the map using an ideal coloring. Just overrides the current coloring.
 */
function setIdealColoring() {
  // Hardcoded for now, would be cool to see which colors the user's already used
  // and reuse those.
  // Or keep their current coloring.
  const colorMapping: Record<string, string> = {
    c1: colorsList[0].hex,
    c2: colorsList[1].hex,
    c3: colorsList[2].hex,
    c4: colorsList[3].hex,
  }

  for (const [state, color] of Object.entries(idealColoring)) {
    mapColoring.value[state] = colorMapping[color]
  }
}

/**
 * Starts the reset timer if it isn't already started.
 * If it fires, it resets the map coloring.
 */
function startResetTimer() {
  if (resetTimerId.value) {
    return
  }

  resetTimerId.value = setTimeout(() => {
    resetTimerId.value = null
    resetMapColors()
  }, TWO_MIN_MS)
}

/**
 * Sets the color of the selected node (state) to a given hex color.
 * Also hides the color picker and resets the reset and interaction timers.
 * @param color The hex color to set the node to, e.g. `'#FF0000'`.
 */
function setSelectedNodeColor(hexColor: string) {
  if (selectedNodeEl.value) {
    mapColoring.value[selectedNodeEl.value.id] = hexColor
  }
}

/**
 * Closes the are you still there dialog.
 * @param show Whether to show the dialog.
 */
function toggleAreYouStillThereDialog(show: boolean) {
  showAreYouStillThereDialog.value = show
}

/**
 * Toggles the color picker and highlights the selected state in the selected fill color.
 * Also resets the interaction timers.
 * @param show Whether to show the color picker.
 */
function toggleColorPicker(show: boolean) {
  showColorPicker.value = show

  resetInteractionTimers()

  if (!show) {
    if (selectedNodeEl.value) {
      selectedNodeEl.value = null
    }

    if (mouseoverNodeId.value) {
      mouseoverNodeId.value = null
    }
  }
}

/**
 * Toggles the info dialog.
 * @param show Whether to show the dialog.
 */
function toggleInfoDialog(show: boolean) {
  showInfoDialog.value = show
}

onMounted(() => {
  resetMapColors()
})
</script>

<template>
  <div id="map-wrapper" class="map-wrapper" @click="onMapWrapperClicked">
    <UncoloredNodeHelperWidget
      v-if="uncoloredNodes.length > 0"
      ref="uncoloredNodeHelperRef"
      class="z-10"
      node-name="States"
      :nodes="uncoloredNodes"
      :node-label-map="nodeIdToName"
      @select-node="selectState"
    />
    <InvalidColoringMessage
      v-if="nodesWithInvalidColorings.length > 1"
      :node-id1="nodeIdToName[nodesWithInvalidColorings[0].nodeId1]"
      :node-id2="nodeIdToName[nodesWithInvalidColorings[0].nodeId2]"
      :hex-color="colorToName(nodesWithInvalidColorings[0].hexColor)"
      @fix="selectState(nodesWithInvalidColorings[0].nodeId1)"
    />
    <MapCompleteMessage
      v-if="showSuccessMessage"
      :colors-used="colorsUsed"
      @reset="onResetButtonClicked"
    />
    <MapViewer
      :map-data="mapData"
      :map-coloring="mapColoring"
      :highlighted-node-id="mouseoverNodeId ?? null"
      :selected-node-id="selectedNodeEl?.id ?? null"
      @empty-clicked="onNodeClicked"
      @node-clicked="onNodeClicked"
      @mouseenter-node="onMouseEnterNode"
      @mouseout-node="onMouseOutNode"
    />
    <ColorPicker
      v-if="showColorPicker"
      :colors="colorsList"
      class="floating-color-picker"
      :style="{ top: `${colorPickerY}px`, left: `${colorPickerX}px` }"
      @color-selected="onColorPickerColorSelected"
    />
    <div>
      <div class="button-wrapper mb-4">
        <AdminButton
          @toggle-admin="onToggleAdmin"
        />
        <MapButtonControls
          @auto-color="setIdealColoring"
          @reset="resetMapColors"
          @open-instructions="openInfoDialog"
        />
      </div>
    </div>
    <div v-if="showInfoDialog || showAreYouStillThereDialog" class="fixed flex inset-0 items-center justify-center z-50">
      <div class="bg-black bg-opacity-50 fixed inset-0" @click="closeDialogs" />
      <InfoDialog
        v-if="showInfoDialog"
        @close="closeDialogs"
      />
      <AreYouStillThereDialog
        v-if="showAreYouStillThereDialog"
        @close="closeDialogs"
      />
    </div>
  </div>
</template>

<style scoped>
.admin-button {
  position: absolute;
  width: 60px;
  height: 52px;
  left: 0;
  top: 0;
  opacity: 0;
  z-index: 10;
}

.button-wrapper {
  position: relative;
}

.floating-color-picker {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 90;
}

.svg-map {
  width: 1000px;
  height: 589px;
  display: inline-block;
  /* viewBox="0 0 1000 589" */
}

.map-wrapper {
  position: relative;
}

li {
  display: list-item;
}
</style>
