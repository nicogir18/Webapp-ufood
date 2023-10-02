<template>
  <div class="card">
    <router-link :to="{ path: '/restaurant', query: { id: id } }">
      <v-btn variant="plain" class="text-blue-500" size="x-large">
        {{ title.length > 33 ? title.split("-")[0] : title }}
      </v-btn>
    </router-link>

    <hr id="separator" />

    <router-link :to="{ path: '/restaurant', query: { id: id } }">
      <img :src="image" alt="Card Image" class="card-image" />
    </router-link>

    <div id="card-footer">
      <star-rating
        id="rating"
        :inline="true"
        :rating="rating"
        :read-only="true"
        :show-rating="false"
        :increment="0.01"
        :star-size="this.screenWidth > 650 ? 50 : 40"
        style="display: inline-block"
      ></star-rating>

      <v-btn
        variant="plain"
        class="bg-blue-500 rounded-full text-white"
        @click="showModal = true"
      >
        <CheckCircleIcon
          class="mr-1 ml-1 h-5 w-5"
          aria-hidden="true"
        ></CheckCircleIcon>
        Rate
      </v-btn>

      <restaurant-visit-modal
        v-model="showModal"
        v-on:closeModal="closeModal"
        :title="title"
        :restaurant_id="id"
        mode="modify"
      />
    </div>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";
import RestaurantVisitModal from "./RestaurantVisitModal";
import { CheckCircleIcon } from "@heroicons/vue/24/solid";

export default {
  data() {
    return {
      showModal: false,
      screenWidth: null,
      screenHeight: null,
    };
  },
  props: {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    StarRating,
    RestaurantVisitModal,
    CheckCircleIcon,
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
    handleResize() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    },
  },
};
</script>

<style scoped>
@media only screen and (max-width: 650px) {
  #card-footer {
    flex-direction: column;
    align-items: center !important;
  }

  .card {
    height: 50vh !important;
  }

  .v-btn__content {
    font-size: 12px !important;
  }

  .vue-star-rating-star {
    height: 30px !important;
    width: 30px !important;
  }

  #rating {
    margin-right: 0px !important;
    margin-bottom: 10px;
  }
}

.card {
  padding: 10px;
  background-color: #fff;
  width: 40vh;
  height: 40vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-image {
  width: 100%;
  border-radius: 20px;
  align-self: center;
  object-fit: cover;
  height: 250px;
}

#card-footer {
  display: flex;
  justify-content: space-evenly;
  margin-top: auto;
  align-items: flex-end;
}

#separator {
  border-top: 5px solid #5482d9;
  margin-bottom: 15px;
  width: 100px;
}

#rating {
  margin-right: 20px;
}
</style>
