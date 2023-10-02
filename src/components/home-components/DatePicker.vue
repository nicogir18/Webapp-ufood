<template>
  <div>
    <VueDatePicker
      show-now-button
      required
      :enable-time-picker="false"
      auto-apply
      placeholder="Select a date"
      :model-value="date"
      @update:model-value="setDate"
      model-type="yyyy-MM-dd'T'HH:mm:ss'Z'"
      :max-date="new Date()"
      :start-date="startDate"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";

const date = ref();
const startDate = ref(new Date(2000, 1));
const emit = defineEmits(["chosenDate"]);

const setDate = (value) => {
  date.value = value;
  emit("chosenDate", value);
};
</script>
