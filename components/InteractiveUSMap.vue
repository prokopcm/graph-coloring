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

const ADMIN_CLICK_TIMEFRAME = 5000
const ONE_MIN_MS = 60000
const TWO_MIN_MS = ONE_MIN_MS * 2

const _mapColoring: USMapColoring = {}

for (const abbrev in stateAbbrevToName) {
  _mapColoring[abbrev] = colorNameHex.BLANK
}

const currentDate = new Date()
const isApril4To6 = currentDate.getMonth() === 3 && currentDate.getDate() >= 4 && currentDate.getDate() <= 6

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

  return uncolored.sort((a, b) => stateAbbrevToName[a].localeCompare(stateAbbrevToName[b]))
})

const completedMap = computed(() => {
  return uncoloredStates.value.length === 0 && invalidColoringStates.value.length === 0
})

// Watch for map fully colored and in a valid state
watch(completedMap, (completed) => {
  if (completed) {
    celebratePuzzleCompletion()
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

function cancelResetTimer() {
  if (resetTimer.value) {
    clearTimeout(resetTimer.value)
    resetTimer.value = null
  }
}

function celebratePuzzleCompletion() {
  showSuccessMessage.value = true

  confetti({
    particleCount: 300,
    spread: 70,
    origin: { x: 0.5, y: 0.5 },
    zIndex: 0,
  })

  if (isApril4To6 && !adminMode.value) {
    startResetTimer()
  }
}

function closeInfoDialog() {
  showInfoDialog.value = false
  resetInteractionTimer()
}

function closeAreYouStillThereDialog() {
  showAreYouStillThereDialog.value = false
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

function mapWrapperClicked(event: MouseEvent) {
  if (event.target instanceof HTMLElement && event.target.id === 'map-wrapper') {
    toggleColorPicker(false)
  }
}

function mouseEnterState(event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id && mapColoring.value[stateElement.id] === colorNameHex.BLANK) {
    mouseoverState.value = stateElement
  }
}

function mouseOutState(event: MouseEvent) {
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

function openInfoDialog() {
  showInfoDialog.value = true
  resetInteractionTimer()
}

function resetInteractionTimer() {
  cancelInteractionTimer()

  if (uncoloredStates.value.length === 50 || !isApril4To6 || adminMode.value) {
    return
  }

  interactionTimer.value = setTimeout(() => {
    interactionTimer.value = null
    showAreYouStillThereDialog.value = true
    startResetTimer()
  }, TWO_MIN_MS)
}

function startResetTimer() {
  if (resetTimer.value) {
    return
  }

  resetTimer.value = setTimeout(() => {
    resetTimer.value = null
    resetStateColors()
  }, TWO_MIN_MS)
}

function stateClicked(event: MouseEvent) {
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

function cancelInteractionTimer() {
  if (interactionTimer.value) {
    clearTimeout(interactionTimer.value)
    interactionTimer.value = null
  }
}

function toggleColorPicker(show: boolean) {
  showColorPicker.value = show

  cancelResetTimer()
  resetInteractionTimer()

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

function resetStateColors() {
  cancelInteractionTimer()
  cancelResetTimer()

  showAreYouStillThereDialog.value = false
  showInfoDialog.value = false

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

function selectState(stateId: string) {
  cancelResetTimer()
  resetInteractionTimer()

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
 * Sets the color of the selected node (state) to a given hex color after a user
 * has selected a color from the color picker.
 * Also hides the color picker and resets the reset and interaction timers.
 * @param color The hex color to set the node to, e.g. `'#FF0000'`.
 */
function onColorPickerColorSelected(hexColor: string) {
  cancelResetTimer()
  resetInteractionTimer()

  if (selectedState.value) {
    setSelectedNodeColor(hexColor)
  }

  toggleColorPicker(false)

  invalidColoringStates.value = getInvalidColoringNodes(adjacentNeighbors)
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

onMounted(() => {
  resetStateColors()
})
</script>

<template>
  <div id="map-wrapper" class="map-wrapper" @click="mapWrapperClicked">
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
        @click.prevent="resetStateColors"
      >
        Reset
      </div>
      <i>the map to try coloring again!</i>
    </div>
    <svg
      class="svg-map"
      xmlns="http://www.w3.org/2000/svg"
      style="stroke-linejoin: round; stroke: #000; fill: none; cursor: pointer;"
      @click.prevent="stateClicked"
    >
      <path
        v-for="state in mapData"
        :id="state.id"
        :key="state.id"
        :d="state.d"
        :style="{ fill: getFillColorForNode(state.id) }"
        @mouseenter="mouseEnterState"
        @mouseout="mouseOutState"
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
          @reset="resetStateColors"
          @open-instructions="openInfoDialog"
        />
      </div>
    </div>
    <div v-if="showInfoDialog" class="fixed flex inset-0 items-center justify-center z-50">
      <div class="bg-black bg-opacity-50 fixed inset-0" @click="closeInfoDialog" />
      <InfoDialog
        @close="closeInfoDialog"
      />
    </div>
    <div v-if="showAreYouStillThereDialog" class="fixed flex inset-0 items-center justify-center z-50">
      <div class="bg-black bg-opacity-50 fixed inset-0" @click="closeAreYouStillThereDialog" />
      <AreYouStillThereDialog
        @close="closeAreYouStillThereDialog"
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
