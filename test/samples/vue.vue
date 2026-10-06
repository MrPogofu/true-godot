<template>
  <div class="counter" :class="{ active: isActive }">
    <h1>{{ title }}</h1>
    <button @click="increment" v-if="count < 10">Count: {{ count }}</button>
    <MyChild v-for="item in items" :key="item.id" :item="item" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
const props = defineProps<{ title: string }>();
const count = ref(0);
const isActive = computed(() => count.value > 0);
function increment() { count.value++; }
</script>

<style scoped>
.counter { color: #cdcfd2; }
</style>
