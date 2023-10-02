<script>
import PicturesCarousel from "./restaurant-component/PicturesCarousel.vue";
import StarRating from "vue-star-rating";
import MapModal from "./restaurant-component/MapModal.vue";
import RestaurantVisitModal from "./home-components/RestaurantVisitModal";
import { CheckCircleIcon } from "@heroicons/vue/24/solid";
import ProblemSnackbar from "@/components/utils/ProblemSnackbar.vue";
import { getRestaurantsById } from "@/api/restaurants.js";
import { getUsersFavoritesList } from "@/api/users.js";
import {
  getFavoritesListByListId,
  addRestaurantsToFavoritesList,
} from "@/api/favorites.js";

export default {
  components: {
    StarRating,
    PicturesCarousel,
    MapModal,
    ProblemSnackbar,
    RestaurantVisitModal,
    CheckCircleIcon,
  },

  data() {
    return {
      restaurant: {},
      pictures: [],
      alert: false,
      snackbarMessage: "error",
      showModal: false,
      showAdd: false,
      showList: true,
      favorites: [],
      user: this.$store.getters.StateUser,
      foundUser: {},
    };
  },
  watch: {
    "$route.query.id": function (newVal, oldVal) {
      this.loadRestaurantData(newVal);
    },
  },
  mounted() {
    this.loadRestaurantData(this.$route.query.id);
    this.fetchUserFavorites();
  },
  methods: {
    loadRestaurantData(id) {
      getRestaurantsById(id)
        .then((res) => {
          this.restaurant = res.data;
          this.pictures = this.restaurant.pictures;
        })
        .catch((error) => {
          this.showSnackbar(
            "Problème avec le chargement des restaurants, veuillez réessayer plus tard"
          );
        });
    },

    async fetchUserFavorites() {
      const userId = this.user.id;

      await getUsersFavoritesList(userId)
        .then((response) => {
          this.favorites = response.data.items.map((user) => {
            return user.name;
          });
        })
        .catch((error) => {
          this.showSnackbar(
            "Problème avec le chargement des restaurants, veuillez réessayer plus tard"
          );
        });
    },

    async fetchUserFavoritesId(name) {
      await getUsersFavoritesList(this.user.id)
        .then((response) => {
          this.foundUser = response.data.items.find((user) => {
            return user.name === name;
          });
        })
        .catch((error) => {
          this.showSnackbar(
            "Problème avec le chargement des restaurants, veuillez réessayer plus tard"
          );
        });
    },

    async fetchFavoriteList() {
      const favoriteListId = this.foundUser.id;

      await getFavoritesListByListId(favoriteListId)
        .then((response) => {
          this.favorite = response.data;
        })
        .catch((error) => {
          this.showSnackbar(
            "Problème avec le chargement des restaurants, veuillez réessayer plus tard"
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
            "Problème avec le chargement des restaurants, veuillez réessayer plus tard"
          );
        });
    },

    async addRestaurantToFavorite(restaurantId) {
      const favoriteListId = this.foundUser.id;
      addRestaurantsToFavoritesList(favoriteListId, restaurantId)
        .then((response) => {
          this.fetchFavoriteList();
        })
        .catch((error) => {
          this.showSnackbar(
            "Problème lors de l'ajout d'un restaurant dans une liste favorites"
          );
        });
    },
    showButton() {
      this.showAdd = !this.showAdd;
      this.showList = !this.showList;
    },
    showSnackbar(message) {
      this.alert = true;
      this.snackbarMessage = message;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>
<template>
  <div id="restaurant-page-background">
    <div id="restaurant-page-container">
      <div class="title-container-info">
        <h2 class="restaurant-title centered">{{ restaurant.name }}</h2>
        <hr class="divider" />
        <div class="title-container">
          <div class="title-container-info">
            <h2 id="rating-title">Rating</h2>
            <star-rating
              id="rating"
              active-color="#5482D9"
              :rating="restaurant.rating"
              :read-only="true"
              :show-rating="false"
              :increment="0.01"
            ></star-rating>
          </div>
          <div>
            <el-dropdown>
              <el-button
                v-if="showList"
                class="bg-blue-500 rounded-full text-white px-8 py-4 hover:bg-blue-600"
              >
                Favorites List
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(value, key) in favorites"
                    :key="key"
                    @click="fetchUserFavoritesId(value), showButton()"
                  >
                    {{ value }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <el-button
            v-if="showAdd"
            class="bg-blue-500 rounded-full text-white px-8 py-4 hover:bg-blue-600"
            @click="addRestaurantToFavorite(restaurant.id), showButton()"
            >Add restaurant to {{ foundUser.name }}
          </el-button>
        </div>
      </div>
      <div id="restaurant-container">
        <div class="picture-carrousel">
          <PicturesCarousel :pictures="pictures" />
        </div>
        <div class="restaurant-information-container">
          <div id="restaurant-information">
            <h2 id="info-title">Information</h2>
            <div class="information-inline">
              <h5 class="information-key">Address:</h5>
              <h5 class="information-value">{{ restaurant.address }}</h5>
              <MapModal
                :location="
                  typeof restaurant.location !== 'undefined'
                    ? restaurant.location
                    : {}
                "
              />
            </div>
            <div class="information-inline">
              <h5 class="information-key">Phone:</h5>
              <h5 class="information-value">{{ restaurant.tel }}</h5>
            </div>
            <div class="information-inline">
              <h5 class="information-key">Opening Hours:</h5>
              <el-dropdown class="information-value">
                <el-button
                  class="bg-blue-500 rounded-full text-white px-4 py-2 hover:bg-blue-600"
                >
                  View Hours
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(value, key) in restaurant.opening_hours"
                      :key="key"
                      disabled
                    >
                      {{ key }} : {{ value }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="information-inline">
              <h5 class="information-key">Features:</h5>
              <v-chip
                class="information-value"
                v-for="genre in restaurant.genres"
                :key="genre"
                >{{ genre }}</v-chip
              >
            </div>
            <div class="information-column">
              <h5 class="information-key">Price Range:</h5>
              <div class="progress-container">
                <progress value="75" max="100"></progress>
              </div>
              <div class="progress-information">
                <span class="information-key">Cheap</span>
                <span class="information-key">Expensive</span>
              </div>
            </div>
            <div class="modal-content">
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
                :title="restaurant.title"
                :restaurant_id="restaurant.id"
                mode="modify"
              ></restaurant-visit-modal>
            </div>
          </div>
          <ProblemSnackbar
            :show="alert"
            v-on:update="alert = $event"
            :message="snackbarMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1,
h2,
h3,
h5,
h4,
span {
  color: #5482d9;
}

.information-value {
  margin-left: 5px;
  margin-right: 10px;
}

.information-key {
  font-weight: 600;
  margin-bottom: 3px;
}

#restaurant-container {
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  margin-right: 10px;
}

.picture-carrousel {
  width: 50%;
  margin-right: 10px;
  border-radius: 30px;
  border: 8px solid #5482d9;
}

#rating-title {
  font-size: 30px;
  font-weight: bold;
  margin-left: 20px;
}

.restaurant-title {
  font-weight: bold;
  font-size: 35px;
}

.centered {
  display: flex;
  justify-content: center;
}

.divider {
  border-top: 5px solid #5482d9;
  margin-bottom: 15px;
  width: 150px;
  margin: auto;
}

#info-title {
  font-size: 25px;
  font-weight: bold;
}

#rating {
  margin-left: 20px;
}

.title-container {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.title-container-info {
  margin-bottom: 30px;
}

.information-inline {
  display: flex;
  margin: 20px;
  margin-left: 5%;
  align-items: center;
  flex-direction: row;
  padding: 2px;
}

.information-column {
  display: flex;
  margin: 20px;
  flex-direction: column;
  padding: 2px;
}

.restaurant-information-container {
  border: 8px solid #5482d9;
  border-radius: 30px;
  width: 50%;
  padding: 5px;
}

progress {
  opacity: 0;
}

.progress-information {
  display: flex;
  margin-top: 5px;
  justify-content: space-between;
  flex-direction: row;
  padding: 2px;
}

.progress-container {
  position: relative;
  background: #eee;
  height: 20px;
  border-radius: 6px;
  overflow: hidden;
}

.progress-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 75%;
  background: dodgerblue;
}

.modal-content {
  display: flex;
  justify-content: center;
  flex-direction: row;
}

#restaurant-page-background {
  height: 100vh;
  background-color: #f4f2f2;
  padding: 10px;
}

#restaurant-page-container {
  background-color: white;
  border-radius: 15px;
  padding: 5px;
  height: 100%;
}

@media only screen and (max-width: 900px) {
  #restaurant-container {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  .title-container {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
  }

  .picture-carrousel {
    width: 100%;
    margin-right: 10px;
    border-radius: 30px;
    border: 8px solid #5482d9;
  }
  .restaurant-information-container {
    border: 8px solid #5482d9;
    border-radius: 30px;
    width: 100%;
    margin-top: 10px;
    padding: 5px;
  }
}
</style>
