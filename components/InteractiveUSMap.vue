<script setup lang="ts">
import confetti from 'canvas-confetti'
import { onMounted, ref, computed, watch } from 'vue'
import { adjacentNeighbors, mapData, stateAbbrevToName } from '~/data/mapData'

interface MapColoring {
  [key: keyof typeof stateAbbrevToName]: string
}

const _mapColoring: MapColoring = {}
for (const abbrev in stateAbbrevToName) {
  _mapColoring[abbrev] = '#FFFFFF'
}

const mapColoring = ref<MapColoring>(_mapColoring)

const selectedState = ref<HTMLElement | null>(null)
const showColorPicker = ref(false)
const colors = ref([
  { hex: '#FF6E6E', rgb: 'rgb(255, 110, 110)', name: 'red' },
  { hex: '#6E9EFF', rgb: 'rgb(110, 158, 255)', name: 'blue' },
  { hex: '#6EFF98', rgb: 'rgb(110, 255, 152)', name: 'green' },
  { hex: '#FFFA6E', rgb: 'rgb(255, 250, 110)', name: 'yellow' },
  { hex: '#FF6EFF', rgb: 'rgb(255, 110, 255)', name: 'pink' },
  { hex: '#FFA64D', rgb: 'rgb(255, 166, 77)', name: 'orange' },
  { hex: '#6EFFFF', rgb: 'rgb(110, 255, 255)', name: 'cyan' },
  { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', name: 'white' },
])
const colorPickerX = ref(0)
const colorPickerY = ref(0)

const invalidColoringStates = ref<NodeWithColor[]>([])

const mouseoverState = ref<HTMLElement | null>(null)
const showInfoDialog = ref(false)
const showSuccessMessage = ref(false)

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

const colorsUsed = computed(() => {
  return new Set(...Object.values(mapColoring.value).filter(color => color !== '#FFFFFF')).size
})

function celebratePuzzleCompletion() {
  showSuccessMessage.value = true
  
  confetti({
    particleCount: 300,
    spread: 70,
    origin: { x: 0.5, y: 0.5 },
    zIndex: 0,
  })
}

onMounted(() => {
  resetStateColors()
})

function getFillColor (stateId: string) {
  if (selectedState.value && selectedState.value.id === stateId || mouseoverState.value && mouseoverState.value.id === stateId) {
    return '#CCFFEE'
  }

  return mapColoring.value[stateId] || '#FFFFFF'
}

function mouseOverState (event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id && mapColoring.value[stateElement.id] === '#FFFFFF') {
    mouseoverState.value = stateElement
  }
}

function mouseOutState (event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id) {
    if (selectedState.value && selectedState.value.id === stateElement.id) {
      console.log('mouseout same as selected state', stateElement.id)
      return
    }
    if (mapColoring.value[stateElement.id]) {
      stateElement.style.fill = mapColoring.value[stateElement.id]
      console.log('mouseout Filling state', stateElement.id)
      return
    }
    mouseoverState.value = null
    console.log('mouseout setting mouseoverState to null')
    // stateElement.style.fill = '#FFFFFF'
  }
}

function resetFillColor (event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id) {
    mapColoring.value[stateElement.id] = '#FFFFFF'
    // stateElement.style.fill = '#FFFFFF'
  }
}

function stateClicked (event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id) {
    if (selectedState.value && selectedState.value.id !== stateElement.id) {
      selectedState.value.style.fill = mapColoring.value[selectedState.value.id] || '#FFFFFF'
    }

    // get page width
    const mapWrapper = document.querySelector('.map-wrapper') as HTMLElement
    const pageWidth = mapWrapper.offsetWidth

    colorPickerX.value = Math.min(event.clientX - 150, pageWidth - 420)
    colorPickerY.value = event.clientY
    selectedState.value = stateElement
    toggleColorPicker(true)
  } else {
    toggleColorPicker(false)
  }
}

function colorToName (hexOrRGB: string) {
  const color = colors.value.find(color => color.hex === hexOrRGB || color.rgb === hexOrRGB)
  return color ? color.name : hexOrRGB
}

function toggleColorPicker (show: boolean) {
  console.log('toggleColorPicker', show)
  showColorPicker.value = show

  if (show) {
    if (selectedState.value) {
      selectedState.value.style.fill = '#CCFFEE'
    }
  } else {
    if (selectedState.value) {
      selectedState.value.style.fill = mapColoring.value[selectedState.value.id] || '#FFFFFF'
      selectedState.value = null
    }

    if (mouseoverState.value) {
      mouseoverState.value = null
    }
  }
}

function selectState (state: string) {
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

function resetStateColors () {
  for (const state in mapColoring.value) {
    mapColoring.value[state] = '#FFFFFF'
  }
  selectedState.value = null
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

function setColor (color: string) {
  if (selectedState.value) {
    selectedState.value.style.fill = color
    mapColoring.value[selectedState.value.id] = color
  }

  toggleColorPicker(false)

  invalidColoringStates.value = getInvalidColoringNodes(adjacentNeighbors)
}

function mapWrapperClicked (event: MouseEvent) {
  if (event.target instanceof HTMLElement && event.target.id === 'map-wrapper') {
    toggleColorPicker(false)
  }
}

function closeInfoDialog() {
  showInfoDialog.value = false
}
</script>

<template>
  <div id="map-wrapper" class="map-wrapper" @click="mapWrapperClicked">
    <div
      v-if="uncoloredStates.length > 0"
      class="uncolored-states ml-2.5 absolute rounded-lg p-2.5 shadow-md"
    >
      <div class="font-bold mb-1.5">
        States Remaining ({{ uncoloredStates.length }}):
      </div>
      <div
        v-for="state in uncoloredStates.slice(0, 3)"
        :key="state"
        style="margin-bottom: 5px; cursor: pointer;"
        @click="selectState(state)"
      >
        {{ stateAbbrevToName[state] }}
      </div>
    </div>
    <div 
      v-if="invalidColoringStates.length > 0"
      class="toast-alert"
      style="position: absolute; bottom: 20px; right: 20px; background-color: #ff6b6b; color: white; padding: 16px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 1000; max-width: 400px;"
      @click="selectState(invalidColoringStates[0].name)"
    >
      {{ invalidColoringStates[0].name }} and {{ invalidColoringStates.length > 1 ? invalidColoringStates[1].name : invalidColoringStates[0].name }} are both {{ colorToName(invalidColoringStates[0].color) }}. Tap on me to fix!
    </div>
    <div 
      v-if="showSuccessMessage"
      class="success-message ml-2.5 absolute"
      style="background-color: #4CAF50; color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); z-index: 1000; text-align: center; max-width: 215px;"
    >
      <h2 style="margin-top: 0; font-size: 24px;">Congratulations! 🎉</h2>
      <p>You've successfully colored the entire map!</p>
      <p>You used {{ colorsUsed }} colors.</p>

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
        @mouseenter="mouseOverState"
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
          v-for="color in colors"
          :key="color.hex"
          :style="{ backgroundColor: color.hex }"
          class="color"
          @click.prevent="setColor(color.hex)"
        />
      </div>
    </div>
    <div>
      <div class="button-wrapper mb-4">
        <button
          class="link-button"
          @click.prevent="resetStateColors"
        >
          Reset
        </button>
        <button 
          class="link-button ml-4"
          @click.prevent="showInfoDialog = true"
        >
          <span class="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help
          </span>
        </button>
      </div>
    </div>
    
    <div v-if="showInfoDialog" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showInfoDialog = false"></div>
      <div class="bg-white rounded-lg shadow-lg max-w-[600px] w-full relative z-10">
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-4 text-left">
            How This Works
          </h2>
          <div class="mb-6 text-left">
            <p class="mb-4">This interactive app demonstrates a math theorem about how many colors are needed to color any map so that no states that touch each other share the same color.</p>
            <p class="mb-2">To color this map:</p>
            <ol class="list-disc pl-6 mb-4">
              <li class="mb-1">Tap on any state to select it</li>
              <li class="mb-1">Choose a color from the color picker</li>
            </ol>
            <p class="mb-1">Try to color the entire map using as few colors as possible without having any states next to each other that share the same color.</p>
            <p class="mt-2 font-bold">Get creative and have fun! 🎨</p>
          </div>
          <div class="flex justify-end">
            <button class="link-button ml-4"
              @click="closeInfoDialog"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-picker-container {
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #000;
  background-color: #FFF;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  z-index: 100;
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
