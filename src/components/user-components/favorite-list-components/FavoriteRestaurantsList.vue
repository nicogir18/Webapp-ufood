<template>
  <div class="rounded overflow-hidden shadow-lg ml-5 mr-5 mt-5">
    <div class="flex align-middle">
      <p
        v-if="!editing"
        class="text-primary-500 font-bold text-xl ml-2 mt-1 truncate"
      >
        {{ favorite.name }}
      </p>
      <div v-if="userMode === 'modify'">
        <input
          v-if="editing"
          type="text"
          v-model="favorite.name"
          @blur="renameFavoriteList(favorite.name)"
          @keypress.enter="renameFavoriteList(favorite.name)"
        />
      </div>
      <button
        v-if="userMode === 'modify'"
        class="ml-1 bg-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        @click="edit"
        :disabled="isFavoriteNameEmpty()"
      >
        <PencilIcon
          class="mr-1 ml-2 h-5 w-5 hover:text-primary-500"
          aria-hidden="true"
        />
      </button>
    </div>
    <div v-if="restaurantsHasItems">
      <div
        class="flex flex-no-wrap overflow-auto scrolling-touch items-start mb-8"
      >
        <div
          v-for="restaurant in favorite.restaurants"
          :key="restaurant.id"
          class="block px-6 py-4 rounded-lg shadow-lg bg-white m-6 w-52 h-32"
        >
          <FavoriteCard
            :restaurant="restaurant"
            v-on:deleteRestaurantFromFavorite="
              deleteRestaurantFromFavorite(restaurant.id)
            "
            :userMode="userMode"
          ></FavoriteCard>
        </div>
      </div>
    </div>
    <div v-else>
      <p>You don't have any restaurant in this list</p>
    </div>
    <div v-if="userMode === 'modify'" class="text-center mb-4">
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <button
            v-if="userMode === 'modify'"
            class="bg-blue-500 rounded-full mr-2 text-white px-4 py-2 hover:bg-blue-600"
            v-bind="props"
          >
            Add restaurant
          </button>
        </template>

        <v-list>
          <v-list-item
            v-for="(restaurant, index) in restaurants.filter(
              (item) =>
                !favorite.restaurants.some((obj) => obj.name === item.name)
            )"
            :key="index"
            @click="addRestaurantToFavoriteList(restaurant.id)"
          >
            <v-list-item-title>{{ restaurant.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <button
        v-if="userMode === 'modify'"
        class="bg-red-500 rounded-full text-white ml-2 px-4 py-2 hover:bg-red-600"
        @click="deleteFavorite"
      >
        Delete List
      </button>
    </div>
    <ProblemSnackbar
      :show="alert"
      v-on:update="alert = $event"
      :message="snackbarMessage"
    />
  </div>
</template>
<script>
import { PencilIcon } from "@heroicons/vue/24/solid";
import FavoriteCard from "./FavoriteCard.vue";
import ProblemSnackbar from "@/components/utils/ProblemSnackbar.vue";
import {
  getFavoritesListByListId,
  removeRestaurantsToFavoritesList,
  updateFavoritesListByListId,
  addRestaurantsToFavoritesList,
} from "@/api/favorites";
import { getRestaurantsById } from "@/api/restaurants";

export default {
  components: {
    PencilIcon,
    FavoriteCard,
    ProblemSnackbar,
  },
  props: {
    id: {},
    restaurants: Object,
    userMode: {
      type: String,
      default: "modify",
    },
  },
  data() {
    return {
      favorite: {
        name: "",
        restaurants: [],
      },
      editing: false,
      originalName: "",
      alert: false,
      snackbarMessage: "error",
    };
  },
  mounted() {
    this.fetchFavoriteList();
  },
  methods: {
    async fetchFavoriteList() {
      const favoriteListId = this.id;

      await getFavoritesListByListId(favoriteListId)
        .then((response) => {
          this.favorite = response.data;
        })
        .catch((error) => {
          this.showSnackbar(
            "Une erreur s'est produite, veuillez réessayer plus tard"
          );
        });
      for (const restaurant of this.favorite.restaurants) {
        await this.fetchRestaurantName(restaurant);
      }
    },

    async fetchRestaurantName(restaurant) {
      await getRestaurantsById(restaurant.id)
        .then((response) => {
          restaurant.name = response.data.name;
        })
        .catch((error) => {
          this.showSnackbar(
            "Une erreur s'est produite, veuillez réessayer plus tard"
          );
        });
    },

    async addRestaurantToFavoriteList(restaurantId) {
      const favoriteListId = this.id;
      await addRestaurantsToFavoritesList(favoriteListId, restaurantId)
        .then((response) => {
          this.fetchFavoriteList();
        })
        .catch((error) => {
          this.showSnackbar(
            "Une erreur s'est produite, veuillez réessayer plus tard"
          );
        });
    },

    restaurantsHasItems() {
      return this.favorite.restaurants.length > 0;
    },

    async deleteRestaurantFromFavorite(restaurantId) {
      const favoriteListId = this.id;
      await removeRestaurantsToFavoritesList(favoriteListId, restaurantId)
        .then((response) => {
          const index = this.favorite.restaurants.findIndex(
            (item) => item.id === restaurantId
          );
          if (index !== -1) {
            this.favorite.restaurants.splice(index, 1);
          }
        })
        .catch((error) => {
          this.showSnackbar(
            "Une erreur s'est produite, veuillez réessayer plus tard"
          );
        });
    },

    deleteFavorite() {
      this.$emit("deleteFavoriteList");
    },

    async renameFavoriteList() {
      const favoriteListId = this.id;
      if (
        this.isFavoriteNameEmpty() ||
        this.favorite.name === this.originalName
      ) {
        this.favorite.name = this.originalName;
        this.endEdit();
        return;
      }
      await updateFavoritesListByListId(favoriteListId, {
        name: this.favorite.name,
        owner: this.favorite.owner.email,
      })
        .then((response) => {
          this.favorite.name = response.data.name;
        })
        .catch((error) => {
          this.favorite.name = this.originalName;
          this.showSnackbar(
            "Une erreur s'est produite, veuillez réessayer plus tard"
          );
        });
      this.endEdit();
    },

    endEdit() {
      this.editing = false;
    },

    edit() {
      this.editing = true;
      this.originalName = this.favorite.name;
    },
    showSnackbar(message) {
      this.alert = true;
      this.snackbarMessage = message;
    },
    isFavoriteNameEmpty() {
      return this.favorite.name === null || this.favorite.name.trim() === "";
    },
    checkFavoriteName() {
      this.favorite.name = this.favorite.name.trim();
    },
  },
};
</script>
