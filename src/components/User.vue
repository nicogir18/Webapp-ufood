<template>
  <div class="flex-column justify-center items-center">
    <div class="rounded overflow-hidden shadow-lg ml-5 mr-5 mt-5">
      <div class="px-6 py-4 m-2">
        <div class="flex justify-between items-center mb-4">
          <div
            class="relative w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-white border-2 border-primary-500 flex items-baseline justify-center"
            id="contGravatar"
          >
            <Gravatar v-if="userMode !== 'read-only'" />
            <Gravatar v-else :id="searchId" />
          </div>

          <div>
            <h2 class="text-primary-500 font-bold text-3xl underline">
              {{ user.name }}
            </h2>
          </div>
        </div>
        <div class="mb-6 flex" id="contRating">
          <div class="text-primary-500 font-bold text-xl mr-6">
            Total Rating : {{ user.rating }}
          </div>
          <div id="contFollow">
            <a
              class="text-primary-500 font-bold text-xl mr-6"
              href="#"
              @click.prevent="showFollowersModal = true"
            >
              Followers : {{ user.followers.length }}
            </a>
            <a
              class="text-primary-500 font-bold text-xl mr-6"
              href="#"
              @click.prevent="showFollowingModal = true"
            >
              Following : {{ user.following.length }}
            </a>
          </div>
          <button
            v-if="!following && userMode === 'read-only'"
            class="bg-white hover:bg-gray-100 text-gray-800 font-semibold px-2 py-1 border border-gray-400 rounded shadow m-3 align-right"
            @click="followUser(user.id)"
          >
            Follow
          </button>
          <button
            v-if="following && userMode === 'read-only'"
            class="bg-white hover:bg-gray-100 text-gray-800 font-semibold px-2 py-1 border border-gray-400 rounded shadow m-3 align-right"
            @click="unfollowUser(user.id)"
          >
            Unfollow
          </button>
        </div>

        <div v-if="user.total > 0">
          <p class="text-primary-500 pb-3 font-bold text-xl">
            Last visits ({{ user.total }}) :
          </p>
          <div
            class="flex flex-no-wrap overflow-auto scrolling-touch items-start mb-8"
          >
            <div
              v-for="visit in user.visits"
              :key="visit.id"
              class="block px-6 py-4 rounded-lg shadow-lg bg-white max-w-sm m-6"
            >
              <VisitCard :visit="visit" />
            </div>
          </div>
        </div>

        <div v-else>
          <p>
            You have not visited any restaurant recently, go back to
            <router-link class="link" to="/">home page</router-link> to find
            some !
          </p>
        </div>
      </div>
    </div>
    <div v-for="favorite in user.favorites" :key="favorite.id">
      <FavoriteRestaurantsList
        :id="favorite.id"
        :restaurants="restaurants"
        v-on:deleteFavoriteList="deleteFavoriteList(favorite.id)"
        :userMode="userMode"
      ></FavoriteRestaurantsList>
    </div>
    <div v-if="userMode !== 'read-only'">
      <FavoriteListCreate
        :email="user.email"
        v-on:fetchUserFavorites="fetchUserFavorites"
      ></FavoriteListCreate>
    </div>
    <FolowListModal
      v-model="showFollowersModal"
      v-on:closeFollowModal="closeFollowModal"
      :users="user.followers"
      mode="followers"
    />
    <FolowListModal
      v-model="showFollowingModal"
      v-on:closeFollowModal="closeFollowModal"
      v-on:unfollow="unfollowUser"
      :users="user.following"
      mode="following"
    />

    <ProblemSnackbar
      :show="alert"
      v-on:update="alert = $event"
      :message="snackbarMessage"
    />
  </div>
</template>

<style>
#contRating {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
}

#contFollow {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
}

#contGravatar {
  margin-right: 5%;
}

@media screen and (max-width: 768px) {
  #contRating {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  #contFollow {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>

<script>
import "../assets/css/main.css";
import VisitCard from "./user-components/VisitCard.vue";
import FavoriteRestaurantsList from "./user-components/favorite-list-components/FavoriteRestaurantsList.vue";
import FavoriteListCreate from "./user-components/favorite-list-components/FavoriteListCreate.vue";
import ProblemSnackbar from "@/components/utils/ProblemSnackbar.vue";
import Gravatar from "@/components/utils/Gravatar.vue";
import {
  getVisitsByUserId,
  getVisitsByUserIdAndRestaurantId,
} from "@/api/visits.js";
import { getRestaurantsById, getRestaurants } from "@/api/restaurants.js";
import {
  getUsersFavoritesList,
  unfollowUser,
  getUsersById,
  followUser,
} from "@/api/users.js";
import { removeFavoritesList } from "@/api/favorites.js";
import FolowListModal from "./user-components/FolowListModal.vue";

export default {
  components: {
    VisitCard,
    FavoriteRestaurantsList,
    FavoriteListCreate,
    ProblemSnackbar,
    FolowListModal,
    Gravatar,
  },
  data() {
    return {
      user: {
        id: "",
        name: "",
        email: "",
        rating: 0,
        total: 0,
        visits: [],
        favorites: [],
        followers: [],
        following: [],
      },
      userMode: this.$route.query.userMode,
      restaurants: [],
      alert: false,
      snackbarMessage: "error",
      showFollowersModal: false,
      showFollowingModal: false,
      searchId: this.$route.query.id,
      following: false,
    };
  },
  watch: {
    "$route.query.userMode": function (newVal, oldVal) {
      this.userMode = newVal;
    },
    "$route.query.id": function (newVal, oldVal) {
      this.searchId = newVal;
      this.fetchUser();
    },
  },
  mounted() {
    this.user = this.$store.getters.StateUser;
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      const id =
        this.searchId === undefined || this.searchId === null
          ? this.$store.getters.StateUser.id
          : this.searchId;
      await getUsersById(id)
        .then((response) => {
          this.user = response.data;
        })
        .catch((error) => {
          this.alert = true;
        });
      this.checkFollowers(this.user.followers);
      await this.fetchUserVisits();

      for (const visit of this.user.visits) {
        const date = visit.date;
        visit.date = this.formatVisitDate(date);
        await this.fetchRestaurantName(visit);
        await this.fetchUserRestaurantVisits(visit);
      }
      await this.fetchUserFavorites();
      await this.fetchRestaurants();
    },

    async fetchUserVisits() {
      const userId = this.user.id;

      await getVisitsByUserId(userId)
        .then((response) => {
          this.user["visits"] = response.data.items;
          this.user["total"] = response.data.total;
        })
        .catch((error) => {
          this.alert = true;
        });
    },
    async fetchRestaurantName(visit) {
      const restaurantId = visit.restaurant_id;

      await getRestaurantsById(restaurantId)
        .then((response) => {
          visit["restaurant_name"] = response.data.name;
        })
        .catch((error) => {
          this.alert = true;
        });
    },
    async fetchUserRestaurantVisits(visit) {
      const restaurantId = visit.restaurant_id;
      const userId = this.user.id;

      await getVisitsByUserIdAndRestaurantId(userId, restaurantId)
        .then((response) => {
          visit["restaurant_visits"] = response.data.total;
        })
        .catch((error) => {
          this.alert = true;
        });
    },
    async fetchUserFavorites() {
      const userId = this.user.id;

      await getUsersFavoritesList(userId)
        .then((response) => {
          this.user["favorites"] = response.data.items;
        })
        .catch((error) => {
          this.alert = true;
        });
    },
    async fetchRestaurants() {
      await getRestaurants()
        .then((response) => {
          this.restaurants = response.data.items.map((restaurant) => {
            return {
              id: restaurant.id,
              name: restaurant.name,
            };
          });
        })
        .catch((error) => {
          this.alert = true;
        });
    },
    async deleteFavoriteList(favoriteId) {
      await removeFavoritesList(favoriteId)
        .then((response) => {
          const index = this.user.favorites.findIndex(
            (item) => item.id === favoriteId
          );
          if (index !== -1) {
            this.user.favorites.splice(index, 1);
          }
        })
        .catch((error) => {
          this.alert = true;
        });
    },
    formatVisitDate(date) {
      const varDate = new Date(date);
      const options = { month: "long", day: "numeric", year: "numeric" };
      return new Intl.DateTimeFormat("en-US", options).format(varDate);
    },
    closeFollowModal() {
      this.showFollowersModal = false;
      this.showFollowingModal = false;
    },
    async unfollowUser(userId) {
      await unfollowUser(userId)
        .then((response) => {
          this.following = false;
          const index = this.user.followers.findIndex(
            (item) => item.id === this.$store.getters.StateUser.id
          );
          if (index !== -1) {
            this.user.followers.splice(index, 1);
          }
        })
        .catch((error) => {
          this.alert = true;
        });
    },
    async followUser(userId) {
      await followUser(userId)
        .then((response) => {
          this.user.followers.push(this.$store.getters.StateUser);
          this.following = true;
        })
        .catch((error) => {
          this.alert = true;
        });
    },
    checkFollowers(followers) {
      for (const user of followers) {
        if (user.id === this.$store.getters.StateUser.id) {
          this.following = true;
          return;
        }
      }
    },
  },
};
</script>
