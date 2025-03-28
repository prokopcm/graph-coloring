<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { mapData } from '~/data/mapData'

  interface StateColors {
    [key: string]: string;
  }

  const stateColors = ref<StateColors>({
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

  function changeFillColor (event: MouseEvent) {
    const stateElement = event.target as HTMLElement

    if (stateElement.tagName === 'path' && stateElement.id) {
      stateElement.style.fill = '#CCFFEE'
      stateColors.value[stateElement.id] = stateElement.style.fill
    }
  }

  function getFillColor (stateId: string) {
    if (selectedState.value && selectedState.value.id === stateId || mouseoverState.value && mouseoverState.value.id === stateId) {
      return '#CCFFEE'
    }

    return stateColors.value[stateId] || '#FFFFFF'
  }

  function mouseOverState (event: MouseEvent) {
    const stateElement = event.target as HTMLElement

    if (stateElement.tagName === 'path' && stateElement.id && stateColors.value[stateElement.id] === '#FFFFFF') {
      mouseoverState.value = stateElement
    }
  }
  
  function mouseOutState (event: MouseEvent) {
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

  function resetFillColor (event: MouseEvent) {
    const stateElement = event.target as HTMLElement

    if (stateElement.tagName === 'path' && stateElement.id) {
      stateColors.value[stateElement.id] = '#FFFFFF'
      // stateElement.style.fill = '#FFFFFF'
    }
  }

  function stateClicked (event: MouseEvent) {
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

  function toggleColorPicker (show: boolean) {
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

  function selectState (state: string) {
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

  function resetStateColors () {
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
  
  function setColor (color: string) {
    if (selectedState.value) {
      selectedState.value.style.fill = color
      stateColors.value[selectedState.value.id] = color
    }

    toggleColorPicker(false)
  }

  function mapWrapperClicked (event: MouseEvent) {
    if (event.target instanceof HTMLElement && event.target.id === 'map-wrapper') {
      toggleColorPicker(false)
    }
  }
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