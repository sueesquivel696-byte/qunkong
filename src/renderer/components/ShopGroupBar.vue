<template>
  <section class="group-bar" aria-label="店铺分组筛选">
    <button
      v-for="group in groups"
      :key="group.id"
      class="group-tab"
      :class="{ active: group.id === modelValue }"
      type="button"
      @click="$emit('update:modelValue', group.id)"
    >
      <span>{{ group.name }}</span>
      <b>{{ group.count }}</b>
    </button>
  </section>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
  groups: { type: Array, default: () => [] },
});

defineEmits(['update:modelValue']);
</script>
