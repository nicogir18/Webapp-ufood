<template>
  <div>
    <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">
      {{ restaurant.name }}
    </h5>
    <div class="flex justify-center items-center">
      <router-link
        :to="{
          path: '/restaurant',
          query: { id: restaurant.id },
        }"
      >
        <button
          class="bg-blue-500 rounded-full text-white px-4 mr-2 py-2 hover:bg-blue-600"
        >
          More...
        </button>
      </router-link>
      <button
        v-if="userMode === 'modify'"
        class="bg-red-500 rounded-full text-white px-4 py-2 hover:bg-red-600"
        @click="deleteRestaurantFromFavorite(restaurant.id)"
      >
        Delete
      </button>
    </div>
  </div>
</template>
<script>
import { stringifyQuery } from "vue-router";
export default {
  props: {
    restaurant: Object,
    userMode: {
      type: String,
      default: "modify",
    },
  },
  methods: {
    deleteRestaurantFromFavorite() {
      this.$emit("deleteRestaurantFromFavorite");
    },
  },
};
</script>
