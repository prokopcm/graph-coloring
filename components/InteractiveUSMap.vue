<script setup lang="ts">
import type { USMapColoring } from '~/data/mapData'
import confetti from 'canvas-confetti'
import { computed, onMounted, ref, watch } from 'vue'
import ColorPicker from '~/components/ColorPicker.vue'
import MapButtonControls from '~/components/MapButtonControls.vue'
import UncoloredNodeHelperWidget from '~/components/UncoloredNodeHelperWidget.vue'
import { colorNameHex, colorsList } from '~/data/colors'
import { adjacentNeighbors, idealColoring, mapData, stateAbbrevToName } from '~/data/mapData'
import { colorToName } from '~/utils/colorUtils'
import { isSciFest, TWO_MIN_MS } from '~/utils/dateTimeUtils'

const ADMIN_CLICK_TIMEFRAME = 5000

const _mapColoring: USMapColoring = {}

for (const abbrev in stateAbbrevToName) {
  _mapColoring[abbrev] = colorNameHex.BLANK
}

const adminMode = ref(false)
const adminClickCount = ref(0)
const adminClickTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const colorPickerX = ref(0)
const colorPickerY = ref(0)
const interactionTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const invalidColoringStates = ref<NodeWithColor[]>([])
const mapColoring = ref<USMapColoring>(_mapColoring)
const mouseoverState = ref<HTMLElement | null>(null)
const resetTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const selectedState = ref<HTMLElement | null>(null)
const showColorPicker = ref(false)
const showAreYouStillThereDialog = ref(false)
const showInfoDialog = ref(false)
const showSuccessMessage = ref(false)

const uncoloredNodeHelperRef = ref<InstanceType<typeof UncoloredNodeHelperWidget> | null>(null)

const colorsUsed = computed(() => {
  const used = new Set(Object.values(mapColoring.value).filter(color => color !== colorNameHex.BLANK))

  return used.size
})

const uncoloredStates = computed(() => {
  const uncolored = Object.entries(mapColoring.value)
    .filter(([_, color]) => color === colorNameHex.BLANK)
    .map(([state, _]) => state)

  return uncolored.sort((a, b) => stateAbbrevToName[a] < stateAbbrevToName[b] ? -1 : 1)
})

const completedMap = computed(() => {
  return uncoloredStates.value.length === 0 && invalidColoringStates.value.length === 0
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
    mouseoverState.value = null

    return
  }

  if (mapColoring.value[hoveredId] !== colorNameHex.BLANK) {
    mouseoverState.value = null

    return
  }

  const stateElement = document.getElementById(hoveredId) as HTMLElement | null

  if (stateElement && stateElement.tagName === 'path') {
    mouseoverState.value = stateElement
  }
})

/**
 * Clears the interaction timer if it is set.
 */
function cancelInteractionTimer() {
  if (interactionTimer.value) {
    clearTimeout(interactionTimer.value)
    interactionTimer.value = null
  }
}

/**
 * Clears the map reset timer if it is set.
 */
function cancelResetTimer() {
  if (resetTimer.value) {
    clearTimeout(resetTimer.value)
    resetTimer.value = null
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
 * Returns the fill color for a given node (state) based on the selected state and mouseover state.
 * @param stateId The ID of the state to get the fill color for, e.g. `'CA'`.
 * @returns The hex fill color to apply to the given node, e.g. `'#FF0000'`.
 */
function getFillColorForNode(stateId: string) {
  if (selectedState.value) {
    if (selectedState.value.id === stateId) {
      return colorNameHex.SELECTED
    }
  }
  else if (mouseoverState.value && mouseoverState.value.id === stateId) {
    return colorNameHex.SELECTED
  }

  return mapColoring.value[stateId] || colorNameHex.BLANK
}

/**
 * Handles the mouse entering a state/node and sets the mouseoverState
 * to the state element if it is uncolored.
 * @param event The mouse enter event.
 */
function onMouseEnterNode(event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id && mapColoring.value[stateElement.id] === colorNameHex.BLANK) {
    mouseoverState.value = stateElement
  }
}

/**
 * Handles the mouse leaving a state/node and resets the mouseoverState.
 * @param event The mouse leave event.
 */
function onMouseOutNode(event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id) {
    if (selectedState.value && selectedState.value.id === stateElement.id) {
      return
    }

    if (mapColoring.value[stateElement.id]) {
      stateElement.style.fill = mapColoring.value[stateElement.id]
    }

    mouseoverState.value = null
  }
}

/**
 * Handles the admin button being clicked and toggles the admin mode.
 */
function onAdminButtonClick() {
  adminClickCount.value++

  if (adminClickCount.value === 1) {
    adminClickTimer.value = setTimeout(() => {
      adminClickCount.value = 0
    }, ADMIN_CLICK_TIMEFRAME)
  }

  if (adminClickCount.value >= 5) {
    adminMode.value = !adminMode.value
    adminClickCount.value = 0

    if (adminClickTimer.value) {
      clearTimeout(adminClickTimer.value)
    }
  }
}

/**
 * Sets the color of the selected node (state) to a given hex color after a user
 * has selected a color from the color picker.
 * Also hides the color picker and resets the reset and interaction timers.
 * @param color The hex color to set the node to, e.g. `'#FF0000'`.
 */
function onColorPickerColorSelected(hexColor: string) {
  resetInteractionTimers()

  if (selectedState.value) {
    setSelectedNodeColor(hexColor)
  }

  toggleColorPicker(false)

  invalidColoringStates.value = getInvalidColoringNodes(adjacentNeighbors)
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
function onNodeClicked(event: PointerEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id) {
    if (selectedState.value && selectedState.value.id !== stateElement.id) {
      selectedState.value.style.fill = mapColoring.value[selectedState.value.id] || colorNameHex.BLANK
    }

    // get page width
    const mapWrapper = document.querySelector('.map-wrapper') as HTMLElement
    const pageWidth = mapWrapper.offsetWidth

    colorPickerX.value = Math.min(event.clientX - 150, pageWidth - 420)
    colorPickerY.value = event.clientY + 10
    selectedState.value = stateElement
    toggleColorPicker(true)
  }
  else {
    toggleColorPicker(false)
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

  if (uncoloredStates.value.length === 50 || !isSciFest || adminMode.value) {
    return
  }

  interactionTimer.value = setTimeout(() => {
    interactionTimer.value = null
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

  selectedState.value = null
  mouseoverState.value = null
  showColorPicker.value = false
  showSuccessMessage.value = false

  // loop through each <path> element and reset the fill style
  for (const stateInfo of mapData) {
    const stateId = stateInfo.id
    const stateElement = document.getElementById(stateId)

    if (stateElement) {
      stateElement.style.fill = colorNameHex.BLANK
    }
  }

  invalidColoringStates.value = []
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
    if (selectedState.value && selectedState.value.id !== stateId) {
      selectedState.value.style.fill = mapColoring.value[selectedState.value.id] || colorNameHex.BLANK
    }

    // Position the color picker near the state element
    const rect = stateElement.getBoundingClientRect()
    const mapWrapper = document.querySelector('.map-wrapper') as HTMLElement
    const pageWidth = mapWrapper.offsetWidth

    colorPickerX.value = Math.min(rect.left, pageWidth - 420)
    colorPickerY.value = rect.bottom

    selectedState.value = stateElement
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
  if (resetTimer.value) {
    return
  }

  resetTimer.value = setTimeout(() => {
    resetTimer.value = null
    resetMapColors()
  }, TWO_MIN_MS)
}

/**
 * Sets the color of the selected node (state) to a given hex color.
 * Also hides the color picker and resets the reset and interaction timers.
 * @param color The hex color to set the node to, e.g. `'#FF0000'`.
 */
function setSelectedNodeColor(hexColor: string) {
  if (selectedState.value) {
    selectedState.value.style.fill = hexColor
    mapColoring.value[selectedState.value.id] = hexColor
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

  if (show) {
    if (selectedState.value) {
      selectedState.value.style.fill = colorNameHex.SELECTED
    }
  }
  else {
    if (selectedState.value) {
      selectedState.value.style.fill = mapColoring.value[selectedState.value.id] || colorNameHex.BLANK
      selectedState.value = null
    }

    if (mouseoverState.value) {
      mouseoverState.value = null
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
      v-if="uncoloredStates.length > 0"
      ref="uncoloredNodeHelperRef"
      node-name="States"
      :nodes="uncoloredStates"
      :node-label-map="stateAbbrevToName"
      @select-node="selectState"
    />
    <div
      v-if="invalidColoringStates.length > 1"
      class="invalid-coloring toast-alert"
      @click="selectState(invalidColoringStates[0].name)"
    >
      {{ stateAbbrevToName[invalidColoringStates[0].name] }} and {{ stateAbbrevToName[invalidColoringStates[1].name] }} are both {{ colorToName(invalidColoringStates[0].color) }}.
      <br>
      Tap on me to fix!
    </div>
    <div
      v-if="showSuccessMessage"
      class="absolute ml-2.5 success-message"
    >
      <h2 style="margin-top: 0; font-size: 24px;">
        Congratulations! 🎉
      </h2>
      <p class="mb-2">
        You successfully colored the map!
      </p>
      <p>You used {{ colorsUsed }} colors.</p>
      <br>
      <div
        class="inline mr-1 small-reset-button"
        style="background-color: #FFFFFF; color: black; padding: 4px 8px 4px 13px; border-radius: 12px; border: 1px solid #000; cursor: pointer; font-size: 14px;"
        @click.prevent="onResetButtonClicked"
      >
        Reset
      </div>
      <i>the map to try coloring again!</i>
    </div>
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
    <ColorPicker
      v-if="showColorPicker"
      :colors="colorsList"
      class="floating-color-picker"
      :style="{ top: `${colorPickerY}px`, left: `${colorPickerX}px` }"
      @color-selected="onColorPickerColorSelected"
    />
    <div>
      <div class="button-wrapper mb-4">
        <div
          class="admin-button"
          @click="onAdminButtonClick"
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

.invalid-coloring {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #ff6b6b;
  color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  z-index: 89;
  max-width: 400px;
  cursor: pointer;
}

.success-message {
  background-color: #4CAF50;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  z-index: 1000;
  text-align: center;
  max-width: 215px;
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
