<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  nodeName: string
  nodes: string[]
  nodeLabelMap?: Record<string, string>
}>()

const emit = defineEmits<{
  (event: 'selectNode', nodeId: string): void
}>()

const hoveredNodeId = ref<string | null>(null)

function onNodeClick(nodeId: string) {
  emit('selectNode', nodeId)
}

function onNodeMouseEnter(nodeId: string) {
  hoveredNodeId.value = nodeId
}

function onNodeMouseLeave(nodeId: string) {
  if (hoveredNodeId.value === nodeId) {
    hoveredNodeId.value = null
  }
}

// Reset hoveredNodeId when nodes prop changes
watch(props.nodes, () => {
  hoveredNodeId.value = null
})

defineExpose({
  hoveredNodeId,
})
</script>

<template>
  <div
    v-if="nodes.length > 0"
    class="absolute ml-2.5 p-2.5 rounded-lg shadow-md uncolored-states bg-white"
  >
    <div class="font-bold mb-1.5">
      {{ nodeName }} left to color:
    </div>
    <div
      v-for="node in nodes.slice(0, 3)"
      :key="node"
      class="uncolored-node-list-item cursor-pointer"
      @click="onNodeClick(node)"
      @mouseenter="onNodeMouseEnter(node)"
      @mouseleave="onNodeMouseLeave(node)"
    >
      {{ nodeLabelMap?.[node] ?? node }}
    </div>
    <div v-if="nodes.length > 3">
      <i style="color: grey; font-size: 0.875em;">and {{ nodes.length - 3 }} more...</i>
    </div>
  </div>
</template>

<style scoped>
.uncolored-node-list-item {
  margin-bottom: 5px;

  &:hover {
    background-color: #f0f0f0;
    border-radius: 4px;
  }
}
</style>
