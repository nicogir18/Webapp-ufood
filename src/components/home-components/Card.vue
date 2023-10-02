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
        :rating="rating"
        :read-only="true"
        :show-rating="false"
        :increment="0.01"
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
  methods: {
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 30px;
  padding: 10px;
  background-color: #fff;
  width: 100%;
  max-width: 400px;
  height: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 300px;
  max-height: 300px;
  border-radius: 20px;
  align-self: center;
  object-fit: cover;
}

#card-footer {
  display: flex;
  flex-wrap: wrap;
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

@media (max-width: 768px) {
  .card {
    width: 90%;
    padding: 5px;
  }

  #separator {
    width: 50px;
  }

  #rating {
    margin-right: 10px;
    margin-top: 5%;
    margin-bottom: 5%;
    flex-basis: auto;
  }
}
</style>
