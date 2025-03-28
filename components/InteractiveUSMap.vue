<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { mapData } from '~/data/mapData'

  interface StateColors {
    [key: string]: string;
  }

  const stateColors = ref<StateColors>({})
  const selectedState = ref<HTMLElement | null>(null)
  const showColorPicker = ref(false)
  const colors = ref(['#FF6E6E', '#6E9EFF', '#6EFF98', '#FFFA6E', '#FF6EFF', '#FFA64D', '#6EFFFF', '#FFFFFF'])
  const clickX = ref(0)
  const clickY = ref(0)

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

  function mouseOverState (event: MouseEvent) {
    const stateElement = event.target as HTMLElement

    if (stateElement.tagName === 'path' && stateElement.id && !stateColors.value[stateElement.id]) {
      stateElement.style.fill = '#CCFFEE'
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
      stateElement.style.fill = '#FFFFFF'
    }
  }

  function resetFillColor (event: MouseEvent) {
    const stateElement = event.target as HTMLElement

    if (stateElement.tagName === 'path' && stateElement.id) {
      stateElement.style.fill = '#FFFFFF'
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

      clickX.value = Math.min(event.clientX - 150, pageWidth - 420)
      clickY.value = event.clientY + 50
      selectedState.value = stateElement
      showColorPicker.value = true
      selectedState.value.style.fill = '#CCFFEE'
    } else {
      showColorPicker.value = false
      if (selectedState.value) {
        selectedState.value.style.fill = stateColors.value[selectedState.value.id] || '#FFFFFF'
        selectedState.value = null
      }
    }
  }

  function resetStateColors () {
    stateColors.value = {}
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

    showColorPicker.value = false
  }
</script>

<template>
  <div class="map-wrapper">
    <svg
      class="svg-map"
      @click="stateClicked"
      xmlns="http://www.w3.org/2000/svg"
      style="stroke-linejoin: round; stroke: #000; fill: none; cursor: pointer;">
      <path
          v-for="state in mapData"
          :key="state.id"
          :id="state.id"
          :d="state.d"
          @mouseenter="mouseOverState"
          @mouseout="mouseOutState"
      />
    </svg>
    <div
      v-if="showColorPicker"
      class="color-picker-container"
      :style="{ top: clickY + 'px', left: clickX + 'px'}"  
    >
      <div class="color-picker">
        <div
          v-for="color in colors"
          :key="color"
          @click="setColor(color)"
          :style="{ backgroundColor: color }"
          class="color"></div>
      </div>
    </div>
    <div>
      <div class="button-wrapper mb-4">
        <button class="link-button" @click="resetStateColors">Reset</button>
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