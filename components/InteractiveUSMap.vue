<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adjacentNeighbors, mapData, stateAbbrevToName } from '~/data/mapData'
import type { GraphNode } from '~/utils/graphUtils'

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
const colors = ref(['#FF6E6E', '#6E9EFF', '#6EFF98', '#FFFA6E', '#FF6EFF', '#FFA64D', '#6EFFFF', '#FFFFFF'])
const colorPickerX = ref(0)
const colorPickerY = ref(0)

const mouseoverState = ref<HTMLElement | null>(null)

const uncoloredStates = computed(() => {
  const uncolored = Object.entries(mapColoring.value)
    .filter(([_, color]) => color === '#FFFFFF')
    .map(([state, _]) => state)

  return uncolored.sort((a, b) => stateAbbrevToName[a].localeCompare(stateAbbrevToName[b]))
})

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
    colorPickerY.value = event.clientY + 50
    selectedState.value = stateElement
    toggleColorPicker(true)
  } else {
    toggleColorPicker(false)
  }
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

  // loop through each <path> element and reset the fill style
  for (const stateInfo of mapData) {
    const stateId = stateInfo.id
    const stateElement = document.getElementById(stateId)
    if (stateElement) {
      stateElement.style.fill = '#FFFFFF'
    }
  }
}

function setColor (color: string) {
  if (selectedState.value) {
    selectedState.value.style.fill = color
    mapColoring.value[selectedState.value.id] = color
  }

  toggleColorPicker(false)
}

function mapWrapperClicked (event: MouseEvent) {
  if (event.target instanceof HTMLElement && event.target.id === 'map-wrapper') {
    toggleColorPicker(false)
  }
}

function neighborsWithSameColor (graphState: GraphNode): Array<{ name: string, color: string }> {
  return graphState.neighbors
    .map((neighbor) => {
      const stateElement = document.getElementById(graphState.name)
      const neighborElement = document.getElementById(neighbor)
      // console.log(stateElement!.style.fill)
      // console.log(neighborElement!.style.fill)
      // console.log(typeof (neighborElement!.style.fill))
      if (
        stateElement && neighborElement
        && stateElement.style.fill === neighborElement.style.fill
        && stateElement.style.fill !== 'rgb(255, 255, 255)'
      ) {
        return {
          name: stateAbbrevToName[neighbor],
          color: neighborElement.style.fill,
        }
      } else {
        return undefined
      }
    })
    .filter(Boolean)
    .reduce((accumulator, current) => {
      if (!current)
        return accumulator
      return [...accumulator, current]
    }, [] as Array<{ name: string, color: string }>)
}

function achievedFourColorTheorem (graph: GraphInterface) {
  return Object.values(graph)
    .map(graphState => neighborsWithSameColor(graphState))
    .filter(Boolean)
    .flat(1)
    .sort((a, b) => {
      if (!a || !b)
        return 0
      const nameA = a.name.toUpperCase()
      const nameB = b.name.toUpperCase()
      if (nameA < nameB)
        return -1
      if (nameA > nameB)
        return 1
      return 0
    })
    .filter((value, index, self) => {
      return (
        value
        && self.findIndex(
          item =>
            item && item.name === value.name && item.color === value.color,
        ) === index
      )
    })
    .filter(value => value !== null && value !== undefined)
}

function miscolorStatePresenter (stateColor: MapColoring) {
  return `<div style="color:${stateColor.color};">${stateColor.name}<div>`
}

const colorCollidingStates = computed(() => {
  const innerHTML = achievedFourColorTheorem(adjacentNeighbors)
    .map(miscolorStatePresenter)
    .join('')
  const remainingColorCollidingStates = document.getElementById('color-colliding-states')
  if (remainingColorCollidingStates) {
    remainingColorCollidingStates.innerHTML = innerHTML
  }
})
</script>

<template>
  <div id="map-wrapper" class="map-wrapper" @click="mapWrapperClicked">
    <div class="uncolored-states" style="float: left; box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2); padding: 10px;">
      <div style="font-weight: bold; margin-bottom: 5px;">
        States Remaining:
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
      style="bottom:100px;box-shadow:3px 3px 8px rgba(0, 0, 0, 0.2);height:200px;left:0;overflow-x:hidden;overflow-y:auto;padding:10px;position:absolute;width:auto;"
    >
      <h2>Bordering States:</h2>
      <h3>(with same color)</h3>
      <div
        v-for="state in uncoloredStates.slice(0, 3)"
        id="color-colliding-states"
        ref="colorCollidingStates"
        :key="state"
        style="background-color: rgba(0, 0, 0, 0.25);cursor: pointer;padding: 5px"
        @click="selectState(state)"
      />
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
          :key="color"
          :style="{ backgroundColor: color }"
          class="color"
          @click.prevent="setColor(color)"
        />
      </div>
    </div>
    <div>
      <div class="button-wrapper mb-4">
        <button class="link-button" @click.prevent="resetStateColors">
          Reset
        </button>
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
</style>
