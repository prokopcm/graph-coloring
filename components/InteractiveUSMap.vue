<script setup lang="ts">
import type { USMapColoring } from '~/data/mapData'
import confetti from 'canvas-confetti'
import { computed, onMounted, ref, watch } from 'vue'
import { colorsList } from '~/data/colors'
import { adjacentNeighbors, idealColoring, mapData, stateAbbrevToName } from '~/data/mapData'
import { colorToName } from '~/utils/colorUtils'

const ADMIN_CLICK_TIMEFRAME = 5000
const ONE_MIN_MS = 60000
const TWO_MIN_MS = ONE_MIN_MS * 2

const _mapColoring: USMapColoring = {}

for (const abbrev in stateAbbrevToName) {
  _mapColoring[abbrev] = '#FFFFFF'
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

const colorsUsed = computed(() => {
  const used = new Set(Object.values(mapColoring.value).filter(color => color !== '#FFFFFF'))

  return used.size
})

const uncoloredStates = computed(() => {
  const uncolored = Object.entries(mapColoring.value)
    .filter(([_, color]) => color === '#FFFFFF')
    .map(([state, _]) => state)

  return uncolored.sort((a, b) => stateAbbrevToName[a].localeCompare(stateAbbrevToName[b]))
})

const completedMap = computed(() => {
  return uncoloredStates.value.length === 0 && invalidColoringStates.value.length === 0
})

// Watch for map fully colored and in a valid state
watch([completedMap], ([completed]) => {
  if (completed) {
    celebratePuzzleCompletion()
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

function getFillColor(stateId: string) {
  if (selectedState.value) {
    if (selectedState.value.id === stateId) {
      return '#CCFFEE'
    }
  }
  else if (mouseoverState.value && mouseoverState.value.id === stateId) {
    return '#CCFFEE'
  }

  return mapColoring.value[stateId] || '#FFFFFF'
}

function mapWrapperClicked(event: MouseEvent) {
  if (event.target instanceof HTMLElement && event.target.id === 'map-wrapper') {
    toggleColorPicker(false)
  }
}

function mouseEnterState(event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id && mapColoring.value[stateElement.id] === '#FFFFFF') {
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
      selectedState.value.style.fill = mapColoring.value[selectedState.value.id] || '#FFFFFF'
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
      selectedState.value.style.fill = '#CCFFEE'
    }
  }
  else {
    if (selectedState.value) {
      selectedState.value.style.fill = mapColoring.value[selectedState.value.id] || '#FFFFFF'
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
    mapColoring.value[state] = '#FFFFFF'
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
      stateElement.style.fill = '#FFFFFF'
    }
  }

  invalidColoringStates.value = []
}

function selectState(state: string) {
  cancelResetTimer()
  resetInteractionTimer()

  const stateElement = document.getElementById(state) as HTMLElement

  if (stateElement && stateElement.tagName === 'path') {
    if (selectedState.value && selectedState.value.id !== state) {
      selectedState.value.style.fill = mapColoring.value[selectedState.value.id] || '#FFFFFF'
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

function setColor(color: string) {
  cancelResetTimer()
  resetInteractionTimer()

  if (selectedState.value) {
    selectedState.value.style.fill = color
    mapColoring.value[selectedState.value.id] = color
  }

  toggleColorPicker(false)

  invalidColoringStates.value = getInvalidColoringNodes(adjacentNeighbors)
}

function setIdealColoring() {
  // Hardcoded for now
  const colorMapping: Record<string, string> = {
    c1: '#FF6E6E',
    c2: '#6E9EFF',
    c3: '#6EFF98',
    c4: '#FFFA6E',
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
    <div
      v-if="uncoloredStates.length > 0"
      class="absolute ml-2.5 p-2.5 rounded-lg shadow-md uncolored-states"
    >
      <div class="font-bold mb-1.5">
        States left to color:
      </div>
      <div
        v-for="state in uncoloredStates.slice(0, 3)"
        :key="state"
        style="margin-bottom: 5px; cursor: pointer;"
        @click="selectState(state)"
      >
        {{ stateAbbrevToName[state] }}
      </div>
      <div v-if="uncoloredStates.length > 3">
        <i style="color: grey; font-size: 0.875em;">and {{ uncoloredStates.length - 3 }} more...</i>
      </div>
    </div>
    <div
      v-if="invalidColoringStates.length > 1"
      class="toast-alert"
      style="position: absolute; bottom: 20px; right: 20px; background-color: #ff6b6b; color: white; padding: 16px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 99; max-width: 400px; cursor: pointer;"
      @click="selectState(invalidColoringStates[0].name)"
    >
      {{ stateAbbrevToName[invalidColoringStates[0].name] }} and {{ stateAbbrevToName[invalidColoringStates[1].name] }} are both {{ colorToName(invalidColoringStates[0].color) }}.
      <br>
      Tap on me to fix!
    </div>
    <div
      v-if="showSuccessMessage"
      class="absolute ml-2.5 success-message"
      style="background-color: #4CAF50; color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); z-index: 1000; text-align: center; max-width: 215px;"
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
        :style="{ fill: getFillColor(state.id) }"
        @mouseenter="mouseEnterState"
        @mouseout="mouseOutState"
      />
    </svg>
    <div
      v-if="showColorPicker"
      class="color-picker-container"
      :style="{ top: `${colorPickerY}px`, left: `${colorPickerX}px` }"
    >
      <div class="color-picker">
        <div
          v-for="color in colorsList"
          :key="color.hex"
          :style="{ backgroundColor: color.hex }"
          class="color"
          @click.prevent="setColor(color.hex)"
        />
      </div>
    </div>
    <div>
      <div class="button-wrapper mb-4">
        <div
          class="admin-button"
          @click="onAdminButtonClick"
        />
        <button
          class="link-button mr-4"
          @click.prevent="setIdealColoring"
        >
          Auto-Color
        </button>
        <button
          class="link-button"
          @click.prevent="resetStateColors"
        >
          Reset
        </button>
        <button
          class="link-button ml-4"
          @click.prevent="openInfoDialog"
        >
          <span class="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 mr-1 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instructions
          </span>
        </button>
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

.color-picker-container {
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #000;
  background-color: #FFF;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  z-index: 90;
}

.color-picker {
  display: flex;
  gap: 14px;
  padding: 16px;
}

.color {
  border-radius: 4px;
  border: 1px solid #999;
  width: 35px;
  height: 35px;
  cursor: pointer;
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
