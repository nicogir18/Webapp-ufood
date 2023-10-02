<template>
  <div class="main-container">
    <div class="home-container">
      <div class="container">
        <div class="dropdown">
          <button
            class="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 dropdown-toggle"
            @click="show = !show"
          >
            <div id="button-text-logo-container">
              Filter
              <img
                class="button-image"
                src="https://img.icons8.com/ios-glyphs/50/ffffff/chevron-down.png"
                v-if="!show"
              />
              <img
                class="button-image"
                src="https://img.icons8.com/ios-glyphs/50/ffffff/chevron-up.png"
                v-else
              />
            </div>
          </button>

          <div v-if="show" class="dropdown-menu">
            <select
              v-model="selectedGenre"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option disabled value="">Choose feature</option>
              <option v-for="genre in genres" :key="genre" :value="genre">
                {{ genre }}
              </option>
            </select>

            <div
              style="
                display: flex;
                align-items: center;
                margin-top: 10px;
                margin-bottom: 10px;
              "
            >
              <span> Restaurant around me : </span>
              <div class="switch">
                <input
                  type="checkbox"
                  id="switch-1"
                  v-model="restaurantAroundMe"
                />
                <label for="switch-1"></label>
              </div>
            </div>
            <div class="slider-container">
              <input
                v-model.number="priceRange"
                type="range"
                min="0"
                max="3"
                step="1"
              />

              <span>{{ this.strToDisplayForPriceRange() }}</span>
            </div>

            <div class="button-container">
              <button
                class="bg-blue-500 rounded-full text-white px-4 py-2 hover:bg-blue-600"
                @click="filterData"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center">
          <span> Map </span>
          <div class="switch">
            <input type="checkbox" id="switch-1" v-model="showComponentA" />
            <label for="switch-1"></label>
          </div>
          <span> List </span>
        </div>
      </div>
      <div class="filter-list" v-if="isFilterApplied">
        <label>Current Filter : </label>
        <v-chip
          class="information-value"
          v-if="selectedGenre !== ''"
          :key="selectedGenre"
          >{{ selectedGenre }}</v-chip
        >

        <v-chip
          class="information-value"
          v-if="priceRange !== 0"
          :key="priceRange"
          >{{ strToDisplayForPriceRange(priceRange) }}</v-chip
        >

        <v-chip
          class="information-value"
          v-if="restaurantAroundMe"
          :key="priceRange"
          >Restaurant around me</v-chip
        >
        <button
          class="bg-red-400 rounded-full text-white px-4 py-2 hover:bg-red-600"
          @click="clearFilter"
        >
          Clear All
        </button>
      </div>

      <div v-if="showComponentA">
        <HomeList
          :restaurants="typeof restaurants !== 'undefined' ? restaurants : []"
        />
      </div>
      <div v-else>
        <div>
          <HomeMap :restaurants="restaurants" />
        </div>
      </div>
    </div>
    <ProblemSnackbar
      :show="alert"
      v-on:update="alert = $event"
      :message="snackbarMessage"
    />
  </div>
</template>

<script>
import HomeList from "./home-components/HomeList.vue";
import HomeMap from "./home-components/HomeMap.vue";
import ProblemSnackbar from "@/components/utils/ProblemSnackbar.vue";
import { getRestaurants, getRestaurantsWithFilter } from "@/api/restaurants.js";

export default {
  components: {
    HomeList,
    HomeMap,
    ProblemSnackbar,
  },
  computed: {
    filteredRestaurants() {
      return this.filterByGenreOrPrice();
    },
  },
  mounted() {
    this.fetchRestaurants();
  },
  watch: {
    restaurantAroundMe(newValue) {
      if (newValue) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { longitude, latitude } = position.coords;
          this.lon = longitude;
          this.lat = latitude;
        });
      } else {
        this.lon = null;
        this.lat = null;
      }
    },
  },
  methods: {
    fetchRestaurants() {
      getRestaurants()
        .then((response) => {
          this.restaurants = response.data.items;

          this.restaurants.forEach((item) => {
            item.genres.forEach((genre) => {
              this.genres.add(genre);
            });
          });
        })
        .catch((error) => {
          this.showSnackbar(
            "Problème avec le chargement des restaurants, veuillez réessayer plus tard"
          );
        });
    },
    filterByGenreOrPrice() {
      getRestaurantsWithFilter(
        this.lon ? this.lon : null,
        this.lat ? this.lat : null,
        null,
        this.priceRange !== 0 ? this.priceRange : null,
        this.selectedGenre !== "" ? this.selectedGenre : null
      )
        .then((res) => {
          this.restaurants = res.data.items;
          this.isFilterApplied = true;
        })
        .catch((error) => {
          this.showSnackbar(
            "Problème avec le chargement des restaurants, veuillez réessayer plus tard"
          );
        });
    },
    filterData() {
      this.show = false;
      this.restaurants = this.filteredRestaurants;
    },
    clearFilter() {
      this.selectedGenre = "";
      this.priceRange = 0;
      this.retaurantAroundMe = false;
      this.show = false;
      this.isFilterApplied = false;
      this.fetchRestaurants();
    },
    strToDisplayForPriceRange() {
      switch (this.priceRange) {
        case 1:
          return "cheap";
        case 2:
          return "medium";
        case 3:
          return "expensive";
        default:
          return "no choice";
      }
    },
    showSnackbar(message) {
      this.alert = true;
      this.snackbarMessage = message;
    },
  },
  data() {
    return {
      showComponentA: true,
      restaurants: [],
      isFilterApplied: false,
      lat: null,
      lon: null,
      selectedGenre: "",
      restaurantAroundMe: false,
      priceRange: 0,
      show: false,
      genres: new Set(),
      alert: false,
      snackbarMessage: "error",
    };
  },
};
</script>

<style scoped>
.filter-list {
  margin-left: 50px;
  margin-bottom: 15px;
}
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: space-evenly;
}

.dropdown {
  position: relative;
  margin-right: 20px;
  margin-left: 50px;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 20px 20px;
  width: 300px;
  z-index: 1;
}

.slider-container {
  display: flex;
  justify-content: space-evenly;
  margin-top: 8px;
  margin-bottom: 15px;
}

.button-image {
  margin-left: 8px;
  width: 20px;
  height: 20px;
}

#button-text-logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.home-container {
  overflow-x: hidden;
  padding: 30px 0px 50px 0px;
  flex-grow: 1;
  background-color: #f4f2f2;
}

.switch {
  position: relative;
  display: inline-flex;
  margin-left: 10px;
  margin-right: 10px;
  width: 60px;
  height: 34px;
}

.switch input {
  display: none;
}

.switch label {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 34px;
  border-radius: 34px;
  background-color: #bdbdbd;
  cursor: pointer;
  transition: background-color 0.2s;
}

.switch label:after {
  content: "";
  display: block;
  position: absolute;
  top: 2px;
  left: 2px;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: margin 0.2s, background-color 0.2s;
}

.switch input:checked + label {
  background-color: #3f83f8;
}

.switch input:checked + label:after {
  margin-left: 28px;
  background-color: #fff;
}

.information-value {
  margin-left: 5px;
  margin-right: 10px;
}
</style>
