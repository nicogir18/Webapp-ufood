<template>
  <div
    v-if="show"
    class="fixed bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
    role="alert"
  >
    <div>
      <span class="block sm:inline">{{ message }}</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3 close-icon">
        <svg
          class="fill-current h-6 w-6 text-red-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          @click="$emit('update', false)"
        >
          <title>Fermer</title>
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: "big problem sir",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.fixed {
  position: fixed;
  width: 80%;
  bottom: 0;
  left: 50%;
  margin-bottom: 10px;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
}

.close-icon {
  display: flex;
  align-items: center;
}
</style>
