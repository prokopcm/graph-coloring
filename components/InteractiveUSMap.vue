<template>
    <div>
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
  
  <script>
  import { mapData } from '~/data/mapData.ts'

  function processMapData(mapData) {
    const elMap = {}
    // mapData.forEach(state => {
    //   stateColors[state.id] = 
    // })
    return elMap
  }


  export default {
    mounted () {
      this.resetStateColors()
    },

    data() {
      return {
        mapData,
        stateColors: {},
        selectedState: null,
        showColorPicker: false,
        colors: ['#FF6E6E', '#6E9EFF', '#6EFF98', '#FFFA6E', '#FF6EFF', '#FFA64D', '#6EFFFF', '#FFFFFF'],
        clickX: 0,
        clickY: 0
      }
    },
    
    methods: {
      changeFillColor (event) {
        const stateElement = event.target

        if (stateElement.tagName === 'path' && stateElement.id) {
          stateElement.style.fill = '#CCFFEE'
          this.stateColors[stateElement.id] = stateElement.style.fill
        }
      },

      mouseOverState (event) {
        const stateElement = event.target

        if (stateElement.tagName === 'path' && stateElement.id && !this.stateColors[stateElement.id]) {
          stateElement.style.fill = '#CCFFEE'
        }
      },
      
      mouseOutState (event) {
        const stateElement = event.target

        if (stateElement.tagName === 'path' && stateElement.id) {
          if (this.selectedState && this.selectedState.id === stateElement.id) {
            return
          }
          if (this.stateColors[stateElement.id]) {
            stateElement.style.fill = this.stateColors[stateElement.id]
            return
          }
          stateElement.style.fill = '#FFFFFF'
        }
      },

      resetFillColor (event) {
        const stateElement = event.target

        if (stateElement.tagName === 'path' && stateElement.id) {
          stateElement.style.fill = '#FFFFFF'
        }
      },

      stateClicked (event) {
        const stateElement = event.target
        
        console.log(event)
        if (stateElement.tagName === 'path' && stateElement.id) {
          if (this.selectedState && this.selectedState.id !== stateElement.id) {
            this.selectedState.style.fill = this.stateColors[this.selectedState.id] || '#FFFFFF'
          }
          this.clickX = event.clientX - 150
          this.clickY = event.clientY + 50
          this.selectedState = stateElement
          this.showColorPicker = true
          this.selectedState.style.fill = '#CCFFEE'
          // stateElement.style.fill = 
        } else {
          this.showColorPicker = false
          this.selectedState.style.fill = this.stateColors[this.selectedState.id] || '#FFFFFF'
          this.selectedState = null
        }
      },

      resetStateColors () {
        this.stateColors = {}
        this.selectedState = null
        this.showColorPicker = false
        
        // loop through each <path> element and reset the fill style
        for (const stateInfo of this.mapData) {
          const stateId = stateInfo.id
          const stateElement = document.getElementById(stateId)
          stateElement.style.fill = '#FFFFFF'
        }

        
      },
      
      setColor (color) {
        if(this.selectedState) {
          this.selectedState.style.fill = color
          this.stateColors[this.selectedState.id] = color
        }

        this.showColorPicker = false
      }
    }
  }
  </script>
  
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
    width: 100%;
    height: 589px;
    /* viewBox="0 0 1000 589" */
  }
  </style>