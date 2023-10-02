<template>
  <div>
    <div class="mapContianer" style="height: 80vh" ref="mapContainer"></div>
    <ProblemSnackbar
      :show="alert"
      v-on:update="alert = $event"
      :message="snackbarMessage"
    />
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import { router } from "@/router";
import { createApp } from "vue";
import MapPopup from "./MapPopup.vue";
import { vuetify } from "../../plugins/vuetifyInstance";
import ProblemSnackbar from "@/components/utils/ProblemSnackbar.vue";

export default {
  components: {
    ProblemSnackbar,
  },
  props: {
    restaurants: {
      type: Array,
    },
  },
  data() {
    return {
      map: null,
      markers: [],
      alert: false,
      snackbarMessage: "Error",
    };
  },
  mounted() {
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_API_TOKEN;

    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 9,
    });

    navigator.geolocation.getCurrentPosition((position) => {
      const { longitude, latitude } = position.coords;
      this.map.setCenter([longitude, latitude]);
    });

    if (typeof this.restaurants !== "undefined") this.addMarkersToMap();
  },
  watch: {
    restaurants(newRestaurants) {
      if (typeof newRestaurants !== "undefined") {
        if (newRestaurants.length === 0) {
          this.showSnackbar("Aucun restaurant trouvé pour ce filtre");
        }
        this.removeMarkersFromMap();
        this.addMarkersToMap(newRestaurants);
      }
    },
  },
  methods: {
    addMarkersToMap(restaurants = this.restaurants) {
      restaurants.forEach((restaurant) => {
        const popupEl = document.createElement("div");

        const picToDisplay = restaurant.pictures[0];
        const app = createApp(MapPopup, {
          image: typeof picToDisplay !== "undefined" ? picToDisplay : "",
          id: restaurant.id,
          title: restaurant.name,
          rating: restaurant.rating,
        });

        app.use(router);
        app.use(vuetify);
        app.mount(popupEl);

        const marker = new mapboxgl.Marker()
          .setLngLat(restaurant.location.coordinates)
          .setPopup(
            new mapboxgl.Popup({
              offset: 15,
              closeButton: false,
              closeOnClick: true,
            }).setDOMContent(popupEl)
          )
          .addTo(this.map);
        this.markers.push(marker);
      });
    },
    removeMarkersFromMap() {
      this.markers.forEach((marker) => {
        marker.remove();
      });
      this.markers = [];
    },
    showSnackbar(message) {
      this.alert = true;
      this.snackbarMessage = message;
    },
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
    this.removeMarkersFromMap();
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
    this.removeMarkersFromMap();
  },
};
</script>

<style>
.mapboxgl-popup-content {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
