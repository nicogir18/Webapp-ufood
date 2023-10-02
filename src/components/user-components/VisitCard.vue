<template>
  <div>
    <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">
      {{ visit.restaurant_name }}
    </h5>
    <p>
      Rate :
      <star-rating
        id="rating"
        :rating="visit.rating"
        :read-only="true"
        :show-rating="false"
        :increment="0.01"
        class="mb-6"
      ></star-rating>
    </p>
    <p class="mb-6"><b>Comment : </b>{{ visit.comment }}</p>
    <div class="flex justify-between items-center">
      <button
        class="bg-blue-500 rounded-full text-white px-4 py-2 hover:bg-blue-600"
        @click="showModal = true"
      >
        More...
      </button>
      <p>Visits: {{ visit.restaurant_visits }}</p>
      <restaurant-visit-modal
        v-model="showModal"
        v-on:closeModal="closeModal"
        :title="visit.restaurant_name"
        :restaurant_id="visit.restaurant_id"
        :rating_value="visit.rating"
        :date_value="visit.date"
        :comment_value="visit.comment"
        mode="read-only"
      ></restaurant-visit-modal>
    </div>
  </div>
</template>
<script>
import StarRating from "vue-star-rating";
import RestaurantVisitModal from "../home-components/RestaurantVisitModal.vue";
export default {
  components: {
    StarRating,
    RestaurantVisitModal,
  },
  props: {
    visit: Object,
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>
