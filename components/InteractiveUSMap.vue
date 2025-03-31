<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {mapData} from '~/data/mapData'

interface StateColor {
  [key: string]: string;
}

const stateColors = ref<StateColor>({
  "AL": "#FFFFFF",
  "AK": "#FFFFFF",
  "AZ": "#FFFFFF",
  "AR": "#FFFFFF",
  "CA": "#FFFFFF",
  "CO": "#FFFFFF",
  "CT": "#FFFFFF",
  "DE": "#FFFFFF",
  "FL": "#FFFFFF",
  "GA": "#FFFFFF",
  "HI": "#FFFFFF",
  "ID": "#FFFFFF",
  "IL": "#FFFFFF",
  "IN": "#FFFFFF",
  "IA": "#FFFFFF",
  "KS": "#FFFFFF",
  "KY": "#FFFFFF",
  "LA": "#FFFFFF",
  "ME": "#FFFFFF",
  "MD": "#FFFFFF",
  "MA": "#FFFFFF",
  "MI": "#FFFFFF",
  "MN": "#FFFFFF",
  "MS": "#FFFFFF",
  "MO": "#FFFFFF",
  "MT": "#FFFFFF",
  "NE": "#FFFFFF",
  "NV": "#FFFFFF",
  "NH": "#FFFFFF",
  "NJ": "#FFFFFF",
  "NM": "#FFFFFF",
  "NY": "#FFFFFF",
  "NC": "#FFFFFF",
  "ND": "#FFFFFF",
  "OH": "#FFFFFF",
  "OK": "#FFFFFF",
  "OR": "#FFFFFF",
  "PA": "#FFFFFF",
  "RI": "#FFFFFF",
  "SC": "#FFFFFF",
  "SD": "#FFFFFF",
  "TN": "#FFFFFF",
  "TX": "#FFFFFF",
  "UT": "#FFFFFF",
  "VT": "#FFFFFF",
  "VA": "#FFFFFF",
  "WA": "#FFFFFF",
  "WV": "#FFFFFF",
  "WI": "#FFFFFF",
  "WY": "#FFFFFF"
})

const stateAbbrevToName: Record<string, string> = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "FL": "Florida",
  "GA": "Georgia",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
}

const selectedState = ref<HTMLElement | null>(null)
const showColorPicker = ref(false)
const colors = ref(['#FF6E6E', '#6E9EFF', '#6EFF98', '#FFFA6E', '#FF6EFF', '#FFA64D', '#6EFFFF', '#FFFFFF'])
const colorPickerX = ref(0)
const colorPickerY = ref(0)

const mouseoverState = ref<HTMLElement | null>(null)

const uncoloredStates = computed(() => {
  const uncolored = Object.entries(stateColors.value)
      .filter(([_, color]) => color === '#FFFFFF')
      .map(([state, _]) => state)

  return uncolored.sort((a, b) => stateAbbrevToName[a].localeCompare(stateAbbrevToName[b]))
})

onMounted(() => {
  resetStateColors()
})

function changeFillColor(event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id) {
    stateElement.style.fill = '#CCFFEE'
    stateColors.value[stateElement.id] = stateElement.style.fill
  }
}

function getFillColor(stateId: string) {
  if (selectedState.value && selectedState.value.id === stateId || mouseoverState.value && mouseoverState.value.id === stateId) {
    return '#CCFFEE'
  }

  return stateColors.value[stateId] || '#FFFFFF'
}

function mouseOverState(event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id && stateColors.value[stateElement.id] === '#FFFFFF') {
    mouseoverState.value = stateElement
  }
}

function mouseOutState(event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id) {
    if (selectedState.value && selectedState.value.id === stateElement.id) {
      return
    }
    if (stateColors.value[stateElement.id]) {
      stateElement.style.fill = stateColors.value[stateElement.id]

      return
    }
    mouseoverState.value = null
    // stateElement.style.fill = '#FFFFFF'
  }
}

function resetFillColor(event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id) {
    stateColors.value[stateElement.id] = '#FFFFFF'
    // stateElement.style.fill = '#FFFFFF'
  }
}

function stateClicked(event: MouseEvent) {
  const stateElement = event.target as HTMLElement

  if (stateElement.tagName === 'path' && stateElement.id) {
    if (selectedState.value && selectedState.value.id !== stateElement.id) {
      selectedState.value.style.fill = stateColors.value[selectedState.value.id] || '#FFFFFF'
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

function toggleColorPicker(show: boolean) {
  console.log('toggleColorPicker', show)
  showColorPicker.value = show

  if (show) {
    if (selectedState.value) {
      selectedState.value.style.fill = '#CCFFEE'
    }
  } else {
    if (selectedState.value) {
      selectedState.value.style.fill = stateColors.value[selectedState.value.id] || '#FFFFFF'
      selectedState.value = null
    }

    if (mouseoverState.value) {
      mouseoverState.value = null
    }
  }
}

function selectState(state: string) {
  const stateElement = document.getElementById(state) as HTMLElement

  if (stateElement && stateElement.tagName === 'path') {
    if (selectedState.value && selectedState.value.id !== state) {
      selectedState.value.style.fill = stateColors.value[selectedState.value.id] || '#FFFFFF'
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

function resetStateColors() {
  for (const state in stateColors.value) {
    stateColors.value[state] = '#FFFFFF'
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

function setColor(color: string) {
  if (selectedState.value) {
    selectedState.value.style.fill = color
    stateColors.value[selectedState.value.id] = color
  }

  toggleColorPicker(false)
}

function mapWrapperClicked(event: MouseEvent) {
  if (event.target instanceof HTMLElement && event.target.id === 'map-wrapper') {
    toggleColorPicker(false)
  }
}

interface StateNode {
  name: string;
  neighbors: string[];
}

interface GraphInterface {
  [key: string]: StateNode;
}

const graph = {
  AL: { name: "AL", neighbors: ["FL", "GA", "MS", "TN"] },
  AK: { name: "AK", neighbors: [] },
  AZ: { name: "AZ", neighbors: ["CA", "CO", "NV", "NM", "UT"] },
  AR: { name: "AR", neighbors: ["LA", "MS", "MO", "OK", "TN", "TX"] },
  CA: { name: "CA", neighbors: ["AZ", "NV", "OR"] },
  CO: {
    name: "CO",
    neighbors: ["AZ", "KS", "NM", "NE", "OK", "UT", "WY"],
  },
  CT: { name: "CT", neighbors: ["MA", "NY", "RI"] },
  DE: { name: "DE", neighbors: ["MD", "NJ", "PA"] },
  FL: { name: "FL", neighbors: ["AL", "GA"] },
  GA: { name: "GA", neighbors: ["AL", "FL", "NC", "SC", "TN"] },
  HI: { name: "HI", neighbors: [] },
  ID: { name: "ID", neighbors: ["MT", "NV", "OR", "UT", "WA", "WY"] },
  IL: { name: "IL", neighbors: ["IN", "IA", "KY", "MO", "WI"] },
  IN: { name: "IN", neighbors: ["IL", "KY", "MI", "OH"] },
  IA: { name: "IA", neighbors: ["IL", "MN", "MO", "NE", "SD", "WI"] },
  KS: { name: "KS", neighbors: ["CO", "MO", "NE", "OK"] },
  KY: {
    name: "KY",
    neighbors: ["IL", "IN", "MO", "OH", "TN", "VA", "WV"],
  },
  LA: { name: "LA", neighbors: ["AR", "MS", "TX"] },
  ME: { name: "ME", neighbors: ["NH"] },
  MD: { name: "MD", neighbors: ["DE", "PA", "VA", "WV"] },
  MA: { name: "MA", neighbors: ["CT", "NH", "NY", "RI", "VT"] },
  MI: { name: "MI", neighbors: ["IN", "OH", "WI"] },
  MN: { name: "MN", neighbors: ["IA", "ND", "WI", "SD"] },
  MS: { name: "MS", neighbors: ["AL", "AR", "LA", "TN"] },
  MO: {
    name: "MO",
    neighbors: ["AR", "IL", "IA", "KS", "KY", "NE", "OK", "TN"],
  },
  MT: { name: "MT", neighbors: ["ID", "ND", "SD", "WY"] },
  NE: { name: "NE", neighbors: ["CO", "IA", "KS", "MO", "SD", "WY"] },
  NV: { name: "NV", neighbors: ["AZ", "CA", "ID", "OR", "UT"] },
  NH: { name: "NH", neighbors: ["ME", "MA", "VT"] },
  NJ: { name: "NJ", neighbors: ["DE", "NY", "PA"] },
  NM: { name: "NM", neighbors: ["AZ", "CO", "OK", "TX", "UT"] },
  NY: { name: "NY", neighbors: ["CT", "MA", "NJ", "PA", "VT"] },
  NC: { name: "NC", neighbors: ["GA", "SC", "TN", "VA"] },
  ND: { name: "ND", neighbors: ["MN", "MT", "SD"] },
  OH: { name: "OH", neighbors: ["IN", "KY", "MI", "PA", "WV"] },
  OK: { name: "OK", neighbors: ["AR", "CO", "KS", "MO", "NM", "TX"] },
  OR: { name: "OR", neighbors: ["CA", "ID", "NV", "WA"] },
  PA: { name: "PA", neighbors: ["DE", "MD", "NY", "NJ", "OH", "WV"] },
  RI: { name: "RI", neighbors: ["CT", "MA"] },
  SC: { name: "SC", neighbors: ["GA", "NC"] },
  SD: { name: "SD", neighbors: ["IA", "MN", "MT", "ND", "NE", "WY"] },
  TN: {
    name: "TN",
    neighbors: ["AL", "AR", "KY", "GA", "MO", "MS", "NC", "VA"],
  },
  TX: { name: "TX", neighbors: ["AR", "LA", "NM", "OK"] },
  UT: { name: "UT", neighbors: ["AZ", "CO", "ID", "NV", "NM", "WY"] },
  VT: { name: "VT", neighbors: ["NY", "NH", "MA"] },
  VA: { name: "VA", neighbors: ["KY", "MD", "NC", "TN", "WV"] },
  WA: { name: "WA", neighbors: ["ID", "OR"] },
  WV: { name: "WV", neighbors: ["KY", "MD", "OH", "PA", "VA"] },
  WI: { name: "WI", neighbors: ["IL", "IA", "MI", "MN"] },
  WY: { name: "WY", neighbors: ["CO", "ID", "MT", "NE", "SD", "UT"] },
};
const states: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

function neighborsWithSameColor(graphState: StateNode): Array<{ name: string; color: string }> {
  return graphState.neighbors
      .map(function (neighbor) {
        const stateElement = document.getElementById(graphState.name);
        const neighborElement = document.getElementById(neighbor);
        if (
            stateElement && neighborElement &&
            stateElement.style.fill === neighborElement.style.fill
        ) {
          return {
            name: states[neighbor],
            color: neighborElement.style.fill,
          };
        } else {
          return undefined;
        }
      })
      .filter(Boolean)
      .reduce((accumulator, current) => {
        if (!current) return accumulator;
        return [...accumulator, current];
      }, [] as Array<{ name: string; color: string }>);
}

function achievedFourColorTheorem(graph: GraphInterface) {
  return Object.values(graph)
      .map((graphState) => neighborsWithSameColor(graphState))
      .filter(Boolean)
      .flat(1)
      .sort(function (a, b) {
        if (!a || !b) return 0;
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      })
      .filter((value, index, self) => {
        return (
            value &&
            self.findIndex(
                (item) =>
                    item && item.name === value.name && item.color === value.color
            ) === index
        );
      })
      .filter(value => value !== null && value !== undefined);
}

function miscolorStatePresenter(stateColor: StateColor) {
  return `<div style="color:${stateColor.color};">${stateColor.name}<div>`;
}

const colorCollidingStates = computed(() => {
  const innerHTML = achievedFourColorTheorem(graph)
      .map(miscolorStatePresenter)
      .join("");
  const remainingColorCollidingStates = document.getElementById("color-colliding-states")
  if (remainingColorCollidingStates) {
    remainingColorCollidingStates.innerHTML = innerHTML;
  }
})
</script>

<template>
  <div id="map-wrapper" class="map-wrapper" @click="mapWrapperClicked">
    <div class="uncolored-states" style="float: left; box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2); padding: 10px;">
      <div style="font-weight: bold; margin-bottom: 5px;">States Remaining:</div>
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
        style="bottom:100px;box-shadow:3px 3px 8px rgba(0, 0, 0, 0.2);height:500px;left:0;overflow-x:hidden;overflow-y:auto;padding:10px;position:absolute;width:auto;"
    >
      <h2>Bordering States:</h2>
      <h3>(with same color)</h3>
      <div
          id="color-colliding-states"
          ref="colorCollidingStates"
          style="background-color: rgba(0, 0, 0, 0.25);cursor: pointer;padding: 5px"
          :key="state"
          v-for="state in uncoloredStates.slice(0, 3)"
          @click="selectState(state)"
      ></div>
    </div>
    <svg
        class="svg-map"
        @click.prevent="stateClicked"
        xmlns="http://www.w3.org/2000/svg"
        style="stroke-linejoin: round; stroke: #000; fill: none; cursor: pointer;">
      <path
          v-for="state in mapData"
          :key="state.id"
          :id="state.id"
          :d="state.d"
          :style="{ fill: getFillColor(state.id) }"
          @mouseenter="mouseOverState"
          @mouseout="mouseOutState"
      />
    </svg>
    <div
        v-if="showColorPicker"
        class="color-picker-container"
        :style="{ top: colorPickerY + 'px', left: colorPickerX + 'px'}"
    >
      <div class="color-picker">
        <div
            v-for="color in colors"
            :key="color"
            @click.prevent="setColor(color)"
            :style="{ backgroundColor: color }"
            class="color"></div>
      </div>
    </div>
    <div>
      <div class="button-wrapper mb-4">
        <button class="link-button" @click.prevent="resetStateColors">Reset</button>
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