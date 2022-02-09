<template>
  HelloWorld 
  <div>鼠标当前位置：x: {{x}}, y: {{y}}</div>
  <router-view />
</template>
<script lang="ts" setup>
import { useMouse  } from '@vueuse/core'
const { x, y } = useMouse()
</script>
<style lang="scss" scoped>

</style>
