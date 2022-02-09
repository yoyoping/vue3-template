<template>
  <img :src="src" alt="" />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { baseAssetsPath } from '../config/index'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  // 是否是全路径
  isFullPath: {
    type: Boolean,
    default: false
  }
})

const src = computed(() => {
  let str = props.src
  if (!props.isFullPath) {
    str = baseAssetsPath + '/images' + props.src
  }
  return str
})

</script>

<style></style>
